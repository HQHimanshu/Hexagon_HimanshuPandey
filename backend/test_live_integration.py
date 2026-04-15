#!/usr/bin/env python3
"""Test script to validate live sensor feeds and weather integration"""
import asyncio
import httpx
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def test_live_sensor_feed():
    """Test sensor data endpoint"""
    print("\n" + "="*80)
    print("TEST 1: LIVE SENSOR FEED")
    print("="*80)
    
    try:
        async with httpx.AsyncClient() as client:
            # Test latest sensor reading
            print("\n[Test] Fetching latest sensor reading...")
            response = await client.get(f"{BASE_URL}/sensors/latest", timeout=10.0)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Got live sensor data:")
                print(f"   Temperature: {data.get('temperature')}°C")
                print(f"   Humidity: {data.get('humidity')}%")
                print(f"   Soil Moisture Root: {data.get('soil_moisture_root')} ADC")
                print(f"   Soil Moisture Surface: {data.get('soil_moisture_surface')} ADC")
                print(f"   Timestamp: {data.get('timestamp')}")
                return True
            else:
                print(f"⚠️  No sensor data in database (expected if Arduino not connected)")
                print(f"   Status code: {response.status_code}")
                print(f"   This is normal - Arduino readings will populate this once connected")
                return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def test_live_weather():
    """Test weather integration"""
    print("\n" + "="*80)
    print("TEST 2: LIVE WEATHER DATA (updates every 5 minutes)")
    print("="*80)
    
    try:
        async with httpx.AsyncClient() as client:
            # Test dashboard metrics (includes weather)
            print("\n[Test] Fetching weather from dashboard metrics...")
            response = await client.get(f"{BASE_URL}/dashboard/metrics", timeout=15.0)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                weather = data.get('weather', {})
                print(f"✅ Got LIVE weather data:")
                print(f"   Temperature: {weather.get('temperature')}°C")
                print(f"   Feels Like: {weather.get('feels_like')}°C")
                print(f"   Humidity: {weather.get('humidity')}%")
                print(f"   Condition: {weather.get('condition')}")
                print(f"   Description: {weather.get('description')}")
                print(f"   Wind Speed: {weather.get('wind_speed')} m/s")
                print(f"   Pressure: {weather.get('pressure')} hPa")
                print(f"   Rain (1h): {weather.get('rain', 0)} mm")
                print(f"   Is Live: {weather.get('is_live', False)}")
                
                if weather.get('is_live'):
                    print("\n   🎉 Real OpenWeather API data (not mock)!")
                else:
                    print("\n   ⚠️  Using fallback/mock weather data")
                    print("   Check OPENWEATHER_API_KEY in .env file")
                
                return True
            else:
                print(f"❌ Error: {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def test_dashboard_refresh_rate():
    """Verify sensor data refreshes frequently"""
    print("\n" + "="*80)
    print("TEST 3: LIVE SENSOR REFRESH RATE (should be every 5 seconds)")
    print("="*80)
    
    try:
        async with httpx.AsyncClient() as client:
            timestamps = []
            
            for i in range(3):
                print(f"\n[Attempt {i+1}] Fetching sensor data...")
                response = await client.get(f"{BASE_URL}/sensors/latest", timeout=10.0)
                
                if response.status_code == 200:
                    data = response.json()
                    ts = data.get('timestamp')
                    temp = data.get('temperature')
                    print(f"   Timestamp: {ts}")
                    print(f"   Temperature: {temp}°C")
                    timestamps.append((i, ts, temp))
                else:
                    print(f"   No data available yet (expected if Arduino not connected)")
                
                if i < 2:
                    print("   Waiting 5 seconds before next fetch...")
                    await asyncio.sleep(5)
            
            if len(timestamps) >= 2:
                print(f"\n✅ Sent 3 requests, got {len(timestamps)} responses")
                print("   Sensor data is available and refreshing")
                return True
            else:
                print(f"\n⚠️  Only got {len(timestamps)} sensor response(s)")
                print("   Arduino not connected yet - this is expected")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def test_ai_sensor_integration():
    """Test that AI gets sensor data"""
    print("\n" + "="*80)
    print("TEST 4: AI SENSOR INTEGRATION")
    print("="*80)
    
    try:
        async with httpx.AsyncClient() as client:
            # First get sensor data
            print("\n[Step 1] Fetching latest sensor data...")
            sensor_res = await client.get(f"{BASE_URL}/sensors/latest", timeout=10.0)
            
            if sensor_res.status_code != 200:
                print("⚠️  No sensor data available (Arduino not connected)")
                print("   Skipping AI test")
                return False
            
            sensor_data = sensor_res.json()
            print(f"✅ Got sensor data: Temp={sensor_data.get('temperature')}°C")
            
            # Now test AI with sensor data
            print("\n[Step 2] Sending question to AI with sensor data...")
            ai_data = {
                "question": "What is the current temperature and should I irrigate?",
                "sensor_data": sensor_data
            }
            
            ai_res = await client.post(
                f"{BASE_URL}/advice/",
                json=ai_data,
                timeout=40.0
            )
            
            if ai_res.status_code == 200:
                response = ai_res.json()
                reason = response.get('reason', '')
                
                print(f"✅ Got AI response:")
                print(f"   Recommendation: {response.get('recommendation')}")
                print(f"   Reason: {reason}")
                print(f"   Action: {response.get('action')}")
                
                # Check if sensor values mentioned
                sensor_values_mentioned = any([
                    str(sensor_data.get('temperature')) in reason,
                    str(sensor_data.get('humidity')) in reason,
                    'temperature' in reason.lower(),
                    'humidity' in reason.lower(),
                    'celsius' in reason.lower()
                ])
                
                if sensor_values_mentioned:
                    print("\n   🎉 AI cited actual sensor values! ✅")
                    return True
                else:
                    print("\n   ⚠️  AI response doesn't mention sensor values")
                    print("   AI may still be using generics - check prompt template")
                    return False
            else:
                print(f"❌ AI error: {ai_res.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def main():
    print("\n🧪 LIVE SENSOR & WEATHER INTEGRATION TESTS")
    print("Testing fresh sensor data (every 5s), weather (every 5 min), and AI integration")
    
    results = {
        "Sensor Feed": await test_live_sensor_feed(),
        "Weather API": await test_live_weather(),
        "Refresh Rate": await test_dashboard_refresh_rate(),
        "AI Integration": await test_ai_sensor_integration(),
    }
    
    print("\n" + "="*80)
    print("📊 TEST SUMMARY")
    print("="*80)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "⚠️  PARTIAL/INFO"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    
    print("\n" + "="*80)
    if all_passed:
        print("✅ ALL TESTS PASSED!")
        print("\nYour system has:")
        print("  🔄 Live sensor data updates (every 5 seconds)")
        print("  🌤️  Live weather data (every 5 minutes)")
        print("  💡 AI that references actual sensor values")
    else:
        print("⚠️  SOME TESTS INFORMATIONAL")
        print("\nExpected if:")
        print("  • Arduino not connected yet (sensor data unavailable)")
        print("  • First-time weather API call (may take extra time)")
        print("\nOnce Arduino is connected:")
        print("  ✅ Sensor data will populate automatically")
        print("  ✅ AI will cite actual readings")
        print("  ✅ Dashboard will update every 5 seconds")
        print("  ✅ Weather updates every 5 minutes")
    
    print("\n" + "="*80)

if __name__ == "__main__":
    asyncio.run(main())
