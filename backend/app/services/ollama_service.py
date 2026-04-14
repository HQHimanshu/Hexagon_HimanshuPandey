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

    # Build simple prompt
    sensor_info = ""
    if sensor_data:
        sensor_info = f"\nCurrent sensor readings:\n- Temperature: {sensor_data.get('temperature', 'N/A')}°C\n- Humidity: {sensor_data.get('humidity', 'N/A')}%\n- Soil Moisture: {sensor_data.get('soil_moisture_root', sensor_data.get('soil_moisture', 'N/A'))}\n- Rain: {'Yes' if sensor_data.get('rain_detected') else 'No'}"

    crop_info = f"\nCrop type: {crop_type}" if crop_type else ""

    lang_name = {"hi": "Hindi", "mr": "Marathi", "en": "English"}.get(language, "English")

    prompt = f"""You are KrishiDrishti, an expert farming assistant for Indian farmers.{crop_info}
{sensor_info}

Farmer's question: {question}

Answer in {lang_name} language. Be practical, specific, and actionable.

Respond ONLY as valid JSON with these keys:
{{
  "recommendation": "One of: IRRIGATE, WAIT, FERTILIZE, HARVEST, PEST_CONTROL, DISEASE_TREATMENT",
  "reason": "Brief 1-2 sentence explanation",
  "action": "Specific steps with timing/quantities",
  "risk": "Any warning or null",
  "confidence": 75
}}"""

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.3,
                    "num_predict": 200
                }
            )
            if response.status_code == 200:
                result = response.json()
                text = result.get("response", "")
                print(f"[AI OK] Response: {text[:100]}...")
                try:
                    start = text.find('{')
                    end = text.rfind('}') + 1
                    if start >= 0 and end > start:
                        advice = json.loads(text[start:end])
                    else:
                        raise ValueError("No JSON")
                except:
                    advice = {
                        "recommendation": "WAIT",
                        "reason": text[:150],
                        "action": "Follow the guidance above",
                        "risk": None,
                        "confidence": 50
                    }
                advice["language"] = language
                advice["confidence_score"] = advice.pop("confidence", 50)
                return advice
    except Exception as e:
        print(f"[AI ERROR] {e}")

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
