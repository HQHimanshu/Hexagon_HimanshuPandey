from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models import User, AdviceLog
from app.schemas import AdviceRequest, AdviceResponse, AdviceHistoryItem
from app.security import verify_token
from app.services import ollama_service

router = APIRouter()


async def get_user_id_or_demo(request: Request, db: AsyncSession):
    """Get user ID from JWT or return demo user"""
    try:
        token = await verify_token(request)
        return token
    except:
        # Demo mode - return user 1 or create demo user
        result = await db.execute(select(User).order_by(User.id.desc()).limit(1))
        user = result.scalar_one_or_none()
        if user:
            return user.id
        # Create demo user
        demo_user = User(phone="+919876543210", name="Demo Farmer", language="en")
        db.add(demo_user)
        await db.commit()
        await db.refresh(demo_user)
        return demo_user.id


@router.post("/", response_model=AdviceResponse)
async def get_advice(
    request: AdviceRequest,
    req: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get AI-powered farming advice using RAG + Qwen"""
    user_id = await get_user_id_or_demo(req, db)

    # Get user data
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Use provided sensor_data or latest from database
    sensor_data = request.sensor_data
    if not sensor_data:
        from app.models import SensorReading
        from sqlalchemy import desc

        sensor_result = await db.execute(
            select(SensorReading)
            .where(SensorReading.user_id == user_id)
            .order_by(desc(SensorReading.timestamp))
            .limit(1)
        )
        latest_reading = sensor_result.scalar_one_or_none()

        if latest_reading:
            sensor_data = {
                "temperature": latest_reading.temperature,
                "humidity": latest_reading.humidity,
                "soil_moisture_surface": latest_reading.soil_moisture_surface,
                "soil_moisture_root": latest_reading.soil_moisture_root,
                "ph_level": latest_reading.ph_level,
                "rain_detected": latest_reading.rain_detected
            }

    # Get advice from AI (25s timeout)
    try:
        import asyncio
        advice = await asyncio.wait_for(
            ollama_service.get_farming_advice(
                user_id=user_id,
                question=request.question,
                sensor_data=sensor_data or {},
                crop_type=user.crop_type,
                language=user.language or "en"
            ),
            timeout=25.0
        )
    except asyncio.TimeoutError:
        print(f"⚠️ AI timeout after 25s")
        advice = ollama_service.get_fallback_advice(
            sensor_data or {},
            user.crop_type,
            user.language or "en"
        )
    except Exception as e:
        print(f"⚠️ AI service error: {e}")
        advice = ollama_service.get_fallback_advice(
            sensor_data or {},
            user.crop_type,
            user.language or "en"
        )

    # Log the advice (async, non-blocking)
    try:
        advice_log = AdviceLog(
            user_id=user_id,
            question=request.question,
            answer=advice.get("reason", "") + "\n" + advice.get("action", ""),
            context_used={"crop": user.crop_type, "sensor_data": sensor_data},
            confidence_score=advice.get("confidence_score"),
            language=advice.get("language", user.language or "en"),
            recommendation_type=advice.get("recommendation")
        )

        db.add(advice_log)
        await db.commit()
        await db.refresh(advice_log)
    except Exception as e:
        print(f"⚠️  Failed to log advice: {e}")
        # Don't fail the response if logging fails

    return AdviceResponse(
        recommendation=advice.get("recommendation", "WAIT"),
        reason=advice.get("reason", ""),
        action=advice.get("action", ""),
        risk=advice.get("risk"),
        confidence_score=advice.get("confidence_score"),
        language=advice.get("language", "en")
    )


@router.get("/history", response_model=list[AdviceHistoryItem])
async def get_advice_history(
    req: Request,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """Get user's advice history"""
    user_id = await get_user_id_or_demo(req, db)
    
    result = await db.execute(
        select(AdviceLog)
        .where(AdviceLog.user_id == user_id)
        .order_by(desc(AdviceLog.timestamp))
        .limit(limit)
    )
    advice_logs = result.scalars().all()
    
    return [
        AdviceHistoryItem(
            id=log.id,
            question=log.question,
            answer=log.answer,
            timestamp=log.timestamp,
            recommendation_type=log.recommendation_type,
            language=log.language
        )
        for log in advice_logs
    ]
