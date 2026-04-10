from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import User
from app.schemas import WeatherResponse
from app.security import verify_token
from app.services import weather_service

router = APIRouter()


@router.get("/current", response_model=WeatherResponse)
async def get_current_weather(
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get current weather data for user's location"""
    
    # Get user's location
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has location data
    if not user.location_lat or not user.location_lng:
        # Use default coordinates (Nagpur, Maharashtra - center of India)
        lat, lng = 21.1458, 79.0882
    else:
        lat, lng = user.location_lat, user.location_lng
    
    # Fetch weather data
    weather_data = await weather_service.get_weather_data(lat, lng)
    
    if not weather_data:
        # Return mock data for development
        mock_weather = weather_service.get_mock_weather()
        return WeatherResponse(**mock_weather)
    
    return WeatherResponse(**weather_data)


@router.get("/forecast", response_model=dict)
async def get_weather_forecast(
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get weather forecast for user's location"""
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    lat = user.location_lat or 21.1458
    lng = user.location_lng or 79.0882
    
    forecast = await weather_service.get_forecast_data(lat, lng)
    
    return {
        "location": {"lat": lat, "lng": lng},
        "forecast": forecast or []
    }
