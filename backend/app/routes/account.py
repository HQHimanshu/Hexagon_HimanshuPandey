from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import User, OTPVerification, Alert, AdviceLog, SensorReading, ResourceLog
from app.schemas import UserResponse
from app.security import verify_token

router = APIRouter()


@router.get("/account-summary", response_model=dict)
async def get_account_summary(
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive user account summary with history"""
    
    # Get user profile
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get OTP history
    otp_result = await db.execute(
        select(OTPVerification)
        .where(OTPVerification.phone == user.email)
        .order_by(OTPVerification.created_at.desc())
        .limit(10)
    )
    otp_history = otp_result.scalars().all()
    
    # Get alert history
    alert_result = await db.execute(
        select(Alert)
        .where(Alert.user_id == user_id)
        .order_by(Alert.timestamp.desc())
        .limit(20)
    )
    alerts = alert_result.scalars().all()
    
    # Get advice history
    advice_result = await db.execute(
        select(AdviceLog)
        .where(AdviceLog.user_id == user_id)
        .order_by(AdviceLog.timestamp.desc())
        .limit(20)
    )
    advice_logs = advice_result.scalars().all()
    
    # Get sensor reading count
    sensor_count_result = await db.execute(
        select(func.count(SensorReading.id))
        .where(SensorReading.user_id == user_id)
    )
    sensor_count = sensor_count_result.scalar() or 0
    
    # Get resource log count
    resource_count_result = await db.execute(
        select(func.count(ResourceLog.id))
        .where(ResourceLog.user_id == user_id)
    )
    resource_count = resource_count_result.scalar() or 0
    
    def user_to_dict(user_obj):
        return {
            "id": user_obj.id,
            "email": user_obj.email,
            "phone": user_obj.phone,
            "name": user_obj.name,
            "region": user_obj.region,
            "crops": user_obj.crops or [],
            "language": user_obj.language,
            "location_lat": user_obj.location_lat,
            "location_lng": user_obj.location_lng,
            "farm_area_acres": user_obj.farm_area_acres,
            "created_at": user_obj.created_at
        }
    
    return {
        "user": user_to_dict(user),
        "account_stats": {
            "total_otp_sent": len(otp_history),
            "total_alerts": len(alerts),
            "total_advice_queries": len(advice_logs),
            "total_sensor_readings": sensor_count,
            "total_resource_logs": resource_count,
            "account_created_at": user.created_at
        },
        "recent_activity": {
            "otp_history": [
                {
                    "created_at": otp.created_at,
                    "is_verified": otp.is_verified,
                    "expires_at": otp.expires_at
                }
                for otp in otp_history[:5]
            ],
            "recent_alerts": [
                {
                    "id": alert.id,
                    "type": alert.type,
                    "channel": alert.channel,
                    "message": getattr(alert, f"message_{user.language}", alert.message_en),
                    "timestamp": alert.timestamp,
                    "is_read": alert.is_read
                }
                for alert in alerts[:5]
            ],
            "recent_advice": [
                {
                    "id": advice.id,
                    "question": advice.question,
                    "timestamp": advice.timestamp,
                    "language": advice.language
                }
                for advice in advice_logs[:5]
            ]
        }
    }


@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get current user profile"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    def user_to_dict_simple(user_obj):
        return {
            "id": user_obj.id,
            "email": user_obj.email,
            "phone": user_obj.phone,
            "name": user_obj.name,
            "region": user_obj.region,
            "crops": user_obj.crops or [],
            "language": user_obj.language,
            "location_lat": user_obj.location_lat,
            "location_lng": user_obj.location_lng,
            "farm_area_acres": user_obj.farm_area_acres,
            "created_at": user_obj.created_at
        }
    
    return user_to_dict_simple(user)


@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_data: dict,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Update user profile"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update allowed fields
    allowed_fields = ['name', 'phone', 'region', 'crops', 'language', 
                     'location_lat', 'location_lng', 'farm_area_acres',
                     'whatsapp_opt_in', 'sms_opt_in', 'email_opt_in', 'voice_opt_in']
    
    for field in allowed_fields:
        if field in profile_data:
            setattr(user, field, profile_data[field])
    
    await db.commit()
    await db.refresh(user)
    
    def user_to_dict_update(user_obj):
        return {
            "id": user_obj.id,
            "email": user_obj.email,
            "phone": user_obj.phone,
            "name": user_obj.name,
            "region": user_obj.region,
            "crops": user_obj.crops or [],
            "language": user_obj.language,
            "location_lat": user_obj.location_lat,
            "location_lng": user_obj.location_lng,
            "farm_area_acres": user_obj.farm_area_acres,
            "created_at": user_obj.created_at
        }
    
    return user_to_dict_update(user)
