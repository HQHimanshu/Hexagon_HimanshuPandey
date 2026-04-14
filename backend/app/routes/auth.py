from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User, OTPVerification, Alert
from app.schemas import (
    OTPRequest, OTPVerify, TokenResponse, UserResponse,
    EmailOTPRequest, EmailOTPVerify,
    SignupOTPRequest, SignupOTPVerify
)
from app.security import create_access_token, generate_otp
from app.utils.validators import validate_phone, validate_email
from app.utils.translations import get_welcome_message
from app.services.notification_service import send_whatsapp, send_email_otp

router = APIRouter()


@router.post("/send-email-otp", response_model=dict)
async def send_email_otp_endpoint(
    email_request: EmailOTPRequest,
    db: AsyncSession = Depends(get_db)
):
    """Send OTP to email for login"""

    # Validate email
    if not validate_email(email_request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Check if user exists
    result = await db.execute(
        select(User).where(User.email == email_request.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email. Please sign up first."
        )

    # Generate OTP
    otp_code = generate_otp()

    # Store OTP in database
    otp_record = OTPVerification(
        phone=email_request.email,  # Using phone field for email OTP
        otp_code=otp_code,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(otp_record)
    await db.commit()

    # Send OTP via email
    try:
        email_result = await send_email_otp(email_request.email, otp_code)
        print(f"✅ Email OTP sent to {email_request.email}: {otp_code}")
    except Exception as e:
        print(f"⚠️ Failed to send email OTP: {e}")
        print(f"📧 [FALLBACK] OTP for {email_request.email}: {otp_code}")
        email_result = {"status": "FALLBACK", "error": str(e)}

    return {
        "message": "OTP sent successfully to email",
        "email": email_request.email,
        "mock_otp": otp_code,
        "delivery_status": email_result.get("status", "UNKNOWN")
    }


@router.post("/verify-email-otp", response_model=TokenResponse)
async def verify_email_otp(
    email_verify: EmailOTPVerify,
    db: AsyncSession = Depends(get_db)
):
    """Verify email OTP and return JWT token"""

    # Find latest OTP for this email
    result = await db.execute(
        select(OTPVerification)
        .where(OTPVerification.phone == email_verify.email)  # Using phone field for email
        .order_by(OTPVerification.created_at.desc())
    )
    otp_record = result.scalar_one_or_none()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP found for this email"
        )

    # Check if OTP is expired
    if datetime.utcnow() > otp_record.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )

    # Check if OTP matches
    if otp_record.otp_code != email_verify.otp_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code"
        )

    # Mark as verified
    otp_record.is_verified = True
    await db.commit()

    # Get user
    result = await db.execute(
        select(User).where(User.email == email_verify.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create JWT token
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(hours=24)
    )

    user_dict = {
        "id": user.id,
        "email": user.email,
        "phone": user.phone,
        "name": user.name,
        "region": user.region,
        "crops": user.crops or [],
        "language": user.language,
        "created_at": user.created_at
    }

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict,
        "is_new_user": False
    }


@router.post("/send-signup-otp", response_model=dict)
async def send_signup_otp(
    signup_request: SignupOTPRequest,
    db: AsyncSession = Depends(get_db)
):
    """Send OTP for new user signup with profile data"""

    # Validate email
    if not validate_email(signup_request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Check if user already exists
    result = await db.execute(
        select(User).where(User.email == signup_request.email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered. Please login instead."
        )

    # Generate OTP
    otp_code = generate_otp()

    # Store OTP in database with signup data
    otp_record = OTPVerification(
        phone=signup_request.email,  # Using phone field for email
        otp_code=otp_code,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(otp_record)
    await db.commit()

    # Send OTP via email
    try:
        email_result = await send_email_otp(signup_request.email, otp_code)
        print(f"✅ Signup OTP sent to {signup_request.email}: {otp_code}")
    except Exception as e:
        print(f"⚠️ Failed to send email OTP: {e}")
        print(f"📧 [FALLBACK] Signup OTP for {signup_request.email}: {otp_code}")
        email_result = {"status": "FALLBACK", "error": str(e)}

    return {
        "message": "OTP sent successfully",
        "email": signup_request.email,
        "mock_otp": otp_code,
        "delivery_status": email_result.get("status", "UNKNOWN")
    }


@router.post("/verify-signup-otp", response_model=TokenResponse)
async def verify_signup_otp(
    signup_verify: SignupOTPVerify,
    db: AsyncSession = Depends(get_db)
):
    """Verify OTP and create new user account"""

    # Find latest OTP for this email
    result = await db.execute(
        select(OTPVerification)
        .where(OTPVerification.phone == signup_verify.email)  # Using phone field for email
        .order_by(OTPVerification.created_at.desc())
    )
    otp_record = result.scalar_one_or_none()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP found for this email"
        )

    # Check if OTP is expired
    if datetime.utcnow() > otp_record.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )

    # Check if OTP matches
    if otp_record.otp_code != signup_verify.otp_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code"
        )

    # Mark as verified
    otp_record.is_verified = True
    await db.commit()

    # Check if user already exists (double-check)
    result = await db.execute(
        select(User).where(User.email == signup_verify.email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered. Please login instead."
        )

    # Create new user with signup data
    new_user = User(
        email=signup_verify.email,
        name=signup_verify.name,
        phone=signup_verify.phone,
        region=signup_verify.region,
        crops=signup_verify.crops or [],
        language=signup_verify.language
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Create welcome notification
    welcome_messages = get_welcome_message()
    welcome_alert = Alert(
        user_id=new_user.id,
        timestamp=datetime.utcnow(),
        type="INFO",
        channel="app",
        message_en=f"Welcome {new_user.name}! Start exploring AI-powered farming advice for your {', '.join(new_user.crops) if new_user.crops else 'crops'} in {new_user.region}.",
        message_hi=welcome_messages['hi'],
        message_mr=welcome_messages['mr'],
        status="SENT",
        is_read=False
    )
    db.add(welcome_alert)
    await db.commit()

    print(f"🎉 New user signup: {new_user.name} ({new_user.email}) from {new_user.region}")
    print(f"   Crops: {', '.join(new_user.crops) if new_user.crops else 'None specified'}")

    # Create JWT token
    access_token = create_access_token(
        data={"sub": new_user.id},
        expires_delta=timedelta(hours=24)
    )

    # Convert user to dict for response
    user_dict = {
        "id": new_user.id,
        "email": new_user.email,
        "phone": new_user.phone,
        "name": new_user.name,
        "region": new_user.region,
        "crops": new_user.crops or [],
        "language": new_user.language,
        "created_at": new_user.created_at
    }

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict,
        "is_new_user": True
    }


@router.post("/send-otp", response_model=dict)
async def send_otp(
    otp_request: OTPRequest,
    db: AsyncSession = Depends(get_db)
):
    """Send OTP to phone number via WhatsApp"""

    # Validate phone number
    if not validate_phone(otp_request.phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number format"
        )

    # Generate OTP
    otp_code = generate_otp()

    # Check if user exists, create if not
    result = await db.execute(
        select(User).where(User.phone == otp_request.phone)
    )
    user = result.scalar_one_or_none()

    if not user:
        user = User(phone=otp_request.phone)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Store OTP in database
    otp_record = OTPVerification(
        phone=otp_request.phone,
        otp_code=otp_code,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(otp_record)
    await db.commit()

    # Send OTP via WhatsApp
    whatsapp_message = f"🌾 *KrishiDrishti OTP Verification*\n\nYour OTP code is: *{otp_code}*\n\nThis code expires in 5 minutes.\n\n_If you didn't request this code, please ignore this message._"
    
    whatsapp_result = {"status": "UNKNOWN", "error": None}
    
    try:
        whatsapp_result = await send_whatsapp(otp_request.phone, whatsapp_message)
        
        # Check if it actually succeeded
        if whatsapp_result.get("status") in ["SENT", "MOCK_SENT"]:
            print(f"✅ WhatsApp OTP sent to {otp_request.phone}: {otp_code}")
        else:
            # Fallback: print OTP to console
            print(f"⚠️ WhatsApp delivery issue: {whatsapp_result}")
            print(f"📱 [FALLBACK] OTP for {otp_request.phone}: {otp_code}")
            
    except Exception as e:
        print(f"❌ WhatsApp send failed: {e}")
        # Fallback to console for development
        print(f"📱 [FALLBACK - WhatsApp Error] OTP for {otp_request.phone}: {otp_code}")
        whatsapp_result = {"status": "FALLBACK", "error": str(e)}

    return {
        "message": "OTP sent successfully",
        "phone": otp_request.phone,
        "mock_otp": otp_code,  # Remove in production
        "delivery_status": whatsapp_result.get("status", "UNKNOWN")
    }


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(
    otp_verify: OTPVerify,
    db: AsyncSession = Depends(get_db)
):
    """Verify OTP and return JWT token"""
    
    # Find latest OTP for this phone
    result = await db.execute(
        select(OTPVerification)
        .where(OTPVerification.phone == otp_verify.phone)
        .order_by(OTPVerification.created_at.desc())
    )
    otp_record = result.scalar_one_or_none()
    
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP found for this phone number"
        )
    
    # Check if OTP is expired
    if datetime.utcnow() > otp_record.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )
    
    # Check if OTP matches
    if otp_record.otp_code != otp_verify.otp_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code"
        )
    
    # Mark as verified
    otp_record.is_verified = True
    await db.commit()
    
    # Get or create user
    result = await db.execute(
        select(User).where(User.phone == otp_verify.phone)
    )
    user = result.scalar_one_or_none()
    is_new_user = False

    if not user:
        user = User(phone=otp_verify.phone)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        is_new_user = True

    # Create welcome notification for new users
    if is_new_user:
        welcome_messages = get_welcome_message()
        welcome_alert = Alert(
            user_id=user.id,
            timestamp=datetime.utcnow(),
            type="INFO",
            channel="app",
            message_en=welcome_messages['en'],
            message_hi=welcome_messages['hi'],
            message_mr=welcome_messages['mr'],
            status="SENT",
            is_read=False
        )
        db.add(welcome_alert)
        await db.commit()
        print(f"🎉 Welcome notification created for new user: {user.phone}")

    # Create JWT token
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(hours=24)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    user_id: int = Depends(lambda: 1),  # Placeholder, use security.verify_token
    db: AsyncSession = Depends(get_db)
):
    """Get current user profile"""
    # Note: In production, use: user_id: int = Depends(verify_token)
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.from_orm(user)


@router.put("/me", response_model=UserResponse)
async def update_user(
    user_update: dict,
    user_id: int = Depends(lambda: 1),
    db: AsyncSession = Depends(get_db)
):
    """Update user profile"""
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    for key, value in user_update.items():
        if hasattr(user, key):
            setattr(user, key, value)
    
    await db.commit()
    await db.refresh(user)
    
    return UserResponse.from_orm(user)
