from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models import User, SensorReading, Alert, AdviceLog, ResourceLog
from app.schemas import DashboardMetrics, SensorResponse, AlertResponse, WeatherResponse, ResourceSummary
from app.security import verify_token
from app.services import weather_service, resource_service
from datetime import date, timedelta

router = APIRouter()


@router.get("/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get aggregated metrics for dashboard"""
    
    # Get user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get latest sensor reading
    sensor_result = await db.execute(
        select(SensorReading)
        .where(SensorReading.user_id == user_id)
        .order_by(desc(SensorReading.timestamp))
        .limit(1)
    )
    latest_sensor = sensor_result.scalar_one_or_none()
    
    # Get weather
    lat = user.location_lat or 21.1458
    lng = user.location_lng or 79.0882
    weather_data = await weather_service.get_weather_data(lat, lng)
    
    if not weather_data:
        weather_data = weather_service.get_mock_weather()
    
    # Get resource summary (30 days)
    resource_summary = await resource_service.get_resource_summary(user_id, db, 30)
    
    # Get recent alerts (last 5)
    alerts_result = await db.execute(
        select(Alert)
        .where(Alert.user_id == user_id)
        .order_by(desc(Alert.timestamp))
        .limit(5)
    )
    recent_alerts = alerts_result.scalars().all()
    
    # Get latest advice
    advice_result = await db.execute(
        select(AdviceLog)
        .where(AdviceLog.user_id == user_id)
        .order_by(desc(AdviceLog.timestamp))
        .limit(1)
    )
    latest_advice = advice_result.scalar_one_or_none()
    
    return DashboardMetrics(
        current_sensor_data=SensorResponse.from_orm(latest_sensor) if latest_sensor else None,
        weather=WeatherResponse(**weather_data),
        resource_summary=ResourceSummary(**resource_summary),
        recent_alerts=[AlertResponse.from_orm(a) for a in recent_alerts],
        latest_advice=None  # Simplified for now
    )


@router.get("/trends", response_model=dict)
async def get_dashboard_trends(
    days: int = 7,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get trend data for charts"""
    
    start_date = date.today() - timedelta(days=days)
    
    # Get sensor readings trend
    sensor_result = await db.execute(
        select(SensorReading)
        .where(
            SensorReading.user_id == user_id,
            SensorReading.timestamp >= start_date
        )
        .order_by(SensorReading.timestamp)
    )
    sensors = sensor_result.scalars().all()
    
    sensor_trend = [
        {
            "timestamp": s.timestamp.isoformat(),
            "temperature": s.temperature,
            "humidity": s.humidity,
            "soil_moisture": s.soil_moisture_root
        }
        for s in sensors
    ]
    
    # Get resource usage trend
    resource_result = await db.execute(
        select(ResourceLog)
        .where(
            ResourceLog.user_id == user_id,
            ResourceLog.date >= start_date
        )
        .order_by(ResourceLog.date)
    )
    resources = resource_result.scalars().all()
    
    resource_trend = [
        {
            "date": r.date.isoformat(),
            "water_used": r.water_used_liters,
            "water_saved": r.water_saved_liters,
            "fertilizer_used": r.fertilizer_used_grams
        }
        for r in resources
    ]
    
    return {
        "sensor_trend": sensor_trend,
        "resource_trend": resource_trend,
        "period_days": days
    }
