#!/usr/bin/env python3
"""Test AI responses with actual sensor data"""
import asyncio
import json
from app.services.ollama_service import get_farming_advice

async def test_ai_responses():
    print("=" * 80)
    print("AI RESPONSE TESTING WITH LIVE SENSOR DATA")
    print("=" * 80)
    
    # Sample sensor data representing current farm conditions
    sensor_data = {
        "temperature": 33.1,
        "humidity": 60.8,
        "soil_moisture_root": 650,  # ~36% moisture
        "soil_moisture_surface": 700,
        "ph_level": 6.8,
        "rain_detected": False,
        "water_tank_level": 75,
        "timestamp": "2024-01-15T14:30:00Z"
    }
    
    # Test questions
    test_questions = [
        "What is the current temperature and humidity in my farm?",
        "Should I irrigate now? Check my soil moisture.",
        "Based on the dashboard readings, what do you recommend?",
        "How's my analytics looking? What about temperature trends?",
        "What can you suggest based on current conditions?",
        "Why is the temperature so high? What should I do?",
    ]
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n[Test {i}] Question: {question}")
        print(f"[Test {i}] Sensor Data: Temp={sensor_data['temperature']}°C, Humidity={sensor_data['humidity']}%, Soil={sensor_data['soil_moisture_root']}")
        print("-" * 80)
        
        try:
            response = await get_farming_advice(
                user_id=1,
                question=question,
                sensor_data=sensor_data,
                crop_type="Rice",
                language="en"
            )
            
            print(f"[Response] Recommendation: {response.get('recommendation')}")
            print(f"[Response] Reason: {response.get('reason')}")
            print(f"[Response] Action: {response.get('action')}")
            print(f"[Response] Risk: {response.get('risk')}")
            print(f"[Response] Confidence: {response.get('confidence_score')}")
            
            # Check if sensor values are mentioned in reason
            reason = response.get('reason', '').lower()
            sensor_mentioned = any(x in reason for x in ['temperature', 'humidity', 'soil', '33.1', '60.8', '650'])
            
            if sensor_mentioned:
                print("✅ Sensor values MENTIONED in response")
            else:
                print("⚠️  Sensor values NOT mentioned in response")
                
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print()

if __name__ == "__main__":
    asyncio.run(test_ai_responses())
