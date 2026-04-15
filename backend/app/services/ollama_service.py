"""Simple Ollama service - Direct Qwen chat, NO RAG"""
import json
import httpx
from typing import Dict, Optional
from app.config import settings


async def get_farming_advice(
    user_id: int,
    question: str,
    sensor_data: Dict,
    crop_type: Optional[str] = None,
    language: str = "en"
) -> Dict:
    """Get farming advice directly from Qwen - NO RAG, FAST"""

    # Check if question is farming or farm-related
    farming_keywords = [
        'crop', 'farm', 'soil', 'water', 'irrigate', 'fertilizer', 'pest', 'disease',
        'harvest', 'plant', 'seed', 'weather', 'rain', 'temperature', 'humidity', 'moisture',
        'rice', 'wheat', 'cotton', 'maize', 'potato', 'tomato', 'onion', 'chili',
        'maharashtra', 'india', 'farming', 'agriculture', 'yield', 'growth', 'stress',
        'dashboard', 'sensor', 'reading', 'analytics', 'data', 'current', 'today',
        'conditions', 'status', 'advice', 'suggest', 'recommend', 'ph', 'nitrogen',
        'micronutrients', 'macro', 'leaf', 'root', 'stem', 'bloom', 'flowering'
    ]

    question_lower = question.lower()
    is_farming_question = any(keyword in question_lower for keyword in farming_keywords)

    # If it's a non-farming question, acknowledge but redirect
    if not is_farming_question or any(x in question_lower for x in ['joke', 'song', 'movie', 'calculus', 'math equation']):
        return {
            "recommendation": "GENERAL",
            "reason": "I'm KrishiDrishti, specialized in smart farming. Please ask about your farm!",
            "action": "Ask about: crops, soil health, irrigation, weather, pests, fertilizers, or current farm conditions",
            "risk": None,
            "confidence_score": 100,
            "language": language
        }

    # Build simple prompt for farming questions
    sensor_info = ""
    if sensor_data:
        sensor_info = f"\nCurrent sensor readings:\n- Temperature: {sensor_data.get('temperature', 'N/A')}°C\n- Humidity: {sensor_data.get('humidity', 'N/A')}%\n- Soil Moisture: {sensor_data.get('soil_moisture_root', sensor_data.get('soil_moisture', 'N/A'))}\n- Rain: {'Yes' if sensor_data.get('rain_detected') else 'No'}"

    crop_info = f"\nCrop type: {crop_type}" if crop_type else ""

    lang_name = {"hi": "Hindi", "mr": "Marathi", "en": "English"}.get(language, "English")

    prompt = f"""You are KrishiDrishti, an expert farming assistant for Indian farmers.{crop_info}
{sensor_info}

Farmer's question: {question}

Answer in {lang_name} language. Be practical, specific, and actionable.

⚠️ CRITICAL INSTRUCTIONS:
1. ALWAYS cite the ACTUAL sensor numbers from above in your "reason" field
2. Your response MUST reference specific temperature, humidity, soil moisture values
3. Example: "Temperature is 33.1°C (elevated), soil at 65% (moderate), humidity 60.8%"
4. Never give generic advice - ALWAYS reference the actual readings provided above
5. If any sensor value is not available, mention it

Respond ONLY as valid JSON with these exact keys:
{{
  "recommendation": "One of: IRRIGATE, WAIT, FERTILIZE, HARVEST, PEST_CONTROL, DISEASE_TREATMENT, MONITOR",
  "reason": "MUST include actual sensor values (temperature, humidity, soil moisture %). 2-3 sentences",
  "action": "Specific steps with timing. Example: 'Irrigate for 45 min today' or 'Wait 2 days and check again'",
  "risk": "Any warning/null",
  "confidence": 75
}}"""

    try:
        print(f"[Ollama] Calling {settings.OLLAMA_BASE_URL}/api/generate with model {settings.OLLAMA_MODEL}")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.5,
                    "num_predict": 300
                },
                timeout=30.0
            )
            print(f"[Ollama] Status code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                text = result.get("response", "").strip()
                print(f"[Ollama] Response length: {len(text)}, First 150 chars: {text[:150]}...")
                
                try:
                    # Try to extract JSON from response
                    start = text.find('{')
                    end = text.rfind('}') + 1
                    if start >= 0 and end > start:
                        json_str = text[start:end]
                        advice = json.loads(json_str)
                        print(f"[Ollama] ✅ Successfully parsed JSON response")
                        
                        # Ensure sensor values are in the reason if they exist
                        if sensor_data and advice.get("reason"):
                            # Check if reason already mentions specific sensor values
                            reason_lower = advice["reason"].lower()
                            should_enhance = True
                            
                            # If reason is too generic, enhance it with sensor values
                            if len(advice["reason"]) < 50 or "based on" not in reason_lower:
                                temp = sensor_data.get('temperature', 'N/A')
                                humidity = sensor_data.get('humidity', 'N/A')
                                soil = sensor_data.get('soil_moisture_root', sensor_data.get('soil_moisture', 'N/A'))
                                
                                if temp != 'N/A' and humidity != 'N/A':
                                    enhanced = f"Temperature: {temp}°C, Humidity: {humidity}%. {advice['reason']}"
                                    if soil != 'N/A':
                                        enhanced = f"Temperature: {temp}°C, Humidity: {humidity}%, Soil: {soil}. {advice['reason']}"
                                    advice["reason"] = enhanced
                                    print(f"[Ollama] Enhanced reason with sensor values")
                    else:
                        print(f"[Ollama] No JSON brackets found in response")
                        raise ValueError("No JSON structure")
                except json.JSONDecodeError as je:
                    print(f"[Ollama] JSON decode error: {je}")
                    advice = {
                        "recommendation": "MONITOR",
                        "reason": text[:150] if text else "Unable to parse AI response",
                        "action": "Continue monitoring farm conditions and irrigate if soil moisture is low.",
                        "risk": None,
                        "confidence": 50
                    }
                except Exception as parse_err:
                    print(f"[Ollama] Parse error: {parse_err}")
                    advice = {
                        "recommendation": "WAIT",
                        "reason": "AI processing your request",
                        "action": "Monitor soil moisture levels and weather conditions.",
                        "risk": None,
                        "confidence": 40
                    }
                
                advice["language"] = language
                advice["confidence_score"] = advice.get("confidence", 50)
                print(f"[Ollama] Final response: {advice}")
                return advice
            else:
                print(f"[Ollama] Server error {response.status_code}: {response.text[:200]}")
                raise Exception(f"Ollama returned {response.status_code}")
    except httpx.TimeoutException:
        print(f"[Ollama] ⏱️ Timeout after 30 seconds - Ollama may be slow or unavailable")
    except httpx.ConnectError:
        print(f"[Ollama] 🔌 Connection error - Cannot reach {settings.OLLAMA_BASE_URL}")
    except Exception as e:
        print(f"[Ollama] ❌ Error: {type(e).__name__}: {e}")

    # Fallback
    return {
        "recommendation": "WAIT",
        "reason": f"Based on your question about '{question[:50]}', monitor your farm conditions closely.",
        "action": "Check soil moisture daily. Irrigate when dry. Watch for pests and diseases.",
        "risk": None,
        "confidence_score": 40,
        "language": language
    }


def get_fallback_advice(sensor_data: Dict, crop_type: Optional[str], language: str) -> Dict:
    """Instant fallback advice"""
    soil = sensor_data.get("soil_moisture_root", sensor_data.get("soil_moisture", 500))
    rec = "IRRIGATE" if (isinstance(soil, (int, float)) and soil > 700) else "WAIT"
    return {
        "recommendation": rec,
        "reason": "AI temporarily unavailable, but based on soil moisture data...",
        "action": "Irrigate if soil is dry. Otherwise wait and monitor.",
        "risk": None,
        "confidence_score": 30,
        "language": language
    }
