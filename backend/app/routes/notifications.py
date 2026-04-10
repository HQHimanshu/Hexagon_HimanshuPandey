from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models import User, Alert
from app.schemas import AlertResponse, AlertTestRequest
from app.security import verify_token
from app.services import notification_service

router = APIRouter()


@router.post("/test", response_model=dict)
async def test_notification(
    test_request: AlertTestRequest,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Send test notification to verify system is working"""
    
    result = await notification_service.send_test_alert(test_request.channel)
    
    return {
        "message": "Test notification sent",
        "results": result
    }


@router.get("/", response_model=list[AlertResponse])
async def get_user_alerts(
    limit: int = 50,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get user's alert history"""
    
    result = await db.execute(
        select(Alert)
        .where(Alert.user_id == user_id)
        .order_by(desc(Alert.timestamp))
        .limit(limit)
    )
    alerts = result.scalars().all()
    
    return [AlertResponse.from_orm(alert) for alert in alerts]


@router.patch("/{alert_id}/read", response_model=dict)
async def mark_alert_read(
    alert_id: int,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Mark an alert as read"""
    
    result = await db.execute(
        select(Alert).where(
            Alert.id == alert_id,
            Alert.user_id == user_id
        )
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_read = True
    await db.commit()
    
    return {"message": "Alert marked as read", "alert_id": alert_id}


@router.post("/send", response_model=dict)
async def send_alert(
    alert_data: dict,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Send alert to user via their preferred channels"""
    
    # Get user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    message_key = alert_data.get("message_key", "irrigate_now")
    
    # Send alert
    results = await notification_service.send_alert(user, message_key, alert_data.get("data", {}))
    
    # Log alert in database
    from app.utils.translations import get_alert_message
    
    alert = Alert(
        user_id=user_id,
        type=alert_data.get("type", "INFO"),
        channel=alert_data.get("channel", "all"),
        message_en=get_alert_message(message_key, "en"),
        message_hi=get_alert_message(message_key, "hi"),
        message_mr=get_alert_message(message_key, "mr"),
        status="SENT"
    )
    
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    
    return {
        "message": "Alert sent successfully",
        "alert_id": alert.id,
        "results": results
    }
