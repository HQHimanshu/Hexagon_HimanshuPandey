import httpx
from typing import Optional, Dict
from app.config import settings
import time


# Cache for weather data (avoid frequent API calls)
_weather_cache = {}
CACHE_DURATION = 1800  # 30 minutes


async def get_weather_data(lat: float, lng: float) -> Optional[Dict]:
    """Fetch current weather data from OpenWeatherMap"""
    
    # Return mock data immediately if no API key configured
    return get_mock_weather()

    cache_key = f"{lat:.2f},{lng:.2f}"
    current_time = time.time()
    
    # Check cache
    if cache_key in _weather_cache:
        cached_data, cached_time = _weather_cache[cache_key]
        if current_time - cached_time < CACHE_DURATION:
            return cached_data
    
    # Fetch from API
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lng,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            
            if response.status_code == 200:
                data = response.json()
                
                weather = {
                    "temperature": data["main"]["temp"],
                    "feels_like": data["main"]["feels_like"],
                    "humidity": data["main"]["humidity"],
                    "description": data["weather"][0]["description"],
                    "wind_speed": data["wind"]["speed"],
                    "pressure": data["main"]["pressure"],
                    "forecast": None,
                    "alert": None
                }
                
                # Check for weather alerts
                alert = check_weather_alerts(weather)
                if alert:
                    weather["alert"] = alert
                
                # Cache the result
                _weather_cache[cache_key] = (weather, current_time)
                
                return weather
            else:
                print(f"⚠️  Weather API error: {response.status_code}")
                return None
    
    except Exception as e:
        print(f"⚠️  Weather fetch error: {e}")
        return None


async def get_forecast_data(lat: float, lng: float) -> Optional[Dict]:
    """Get 5-day forecast (simplified)"""
    
    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "lat": lat,
            "lon": lng,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric",
            "cnt": 8  # 24 hours (3-hour intervals)
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            
            if response.status_code == 200:
                data = response.json()
                
                forecast = []
                for item in data.get("list", [])[:8]:
                    forecast.append({
                        "datetime": item.get("dt_txt"),
                        "temperature": item["main"]["temp"],
                        "description": item["weather"][0]["description"],
                        "rain_probability": item.get("pop", 0) * 100
                    })
                
                return forecast
            else:
                return None
    
    except Exception as e:
        print(f"⚠️  Forecast fetch error: {e}")
        return None


def check_weather_alerts(weather: Dict) -> Optional[str]:
    """Check for critical weather conditions"""
    alerts = []
    
    if weather.get("temperature", 0) > 40:
        alerts.append("अत्यधिक तापमान चेतावनी - अधिक सिंचाई की आवश्यकता हो सकती है")
    
    if weather.get("wind_speed", 0) > 50:
        alerts.append("तेज हवा की चेतावनी - फसल को नुकसान हो सकता है")
    
    if weather.get("humidity", 0) > 90:
        alerts.append("उच्च आर्द्रता - फंगल रोग का खतरा")
    
    return " | ".join(alerts) if alerts else None


def get_mock_weather() -> Dict:
    """Return mock weather data for development/demo"""
    return {
        "temperature": 32.5,
        "feels_like": 35.0,
        "humidity": 65.0,
        "description": "partly cloudy",
        "wind_speed": 12.5,
        "pressure": 1012,
        "forecast": [
            {
                "datetime": "2024-01-01 12:00:00",
                "temperature": 33.0,
                "description": "sunny",
                "rain_probability": 10
            },
            {
                "datetime": "2024-01-01 15:00:00",
                "temperature": 31.0,
                "description": "partly cloudy",
                "rain_probability": 20
            }
        ],
        "alert": None
    }
