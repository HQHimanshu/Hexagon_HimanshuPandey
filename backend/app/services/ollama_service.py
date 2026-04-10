import json
import httpx
from typing import Dict, Optional
from app.config import settings
from app.services import rag_service


async def get_farming_advice(
    user_id: int,
    question: str,
    sensor_data: Dict,
    crop_type: Optional[str] = None,
    language: str = "en"
) -> Dict:
    """Get farming advice using RAG + Qwen via Ollama"""
    
    # Step 1: Retrieve relevant crop knowledge from ChromaDB
    rag_filters = {}
    if crop_type:
        rag_filters["crop"] = crop_type
    
    context_docs = await rag_service.retrieve(
        query=f"{crop_type or 'farming'} advice",
        n_results=3,
        filters=rag_filters if rag_filters else None
    )
    
    context = "\n\n".join(context_docs) if context_docs else "No specific crop knowledge available"
    
    # Step 2: Build structured prompt
    sensor_json = json.dumps(sensor_data, indent=2) if sensor_data else "No sensor data available"
    
    language_name = {
        "hi": "Hindi",
        "mr": "Marathi",
        "en": "English"
    }.get(language, "English")
    
    prompt = f"""You are KrishiDrishti (कृषिदृष्टि), an expert agricultural assistant for Indian farmers.

CROP KNOWLEDGE:
{context}

CURRENT SENSOR DATA:
{sensor_json}

CROP TYPE: {crop_type or "Unknown"}

FARMER'S QUESTION: {question}

Please provide advice in {language_name} language with the following structure as JSON:
{{
  "recommendation": "One of: IRRIGATE, WAIT, FERTILIZE, HARVEST, PEST_CONTROL, DISEASE_TREATMENT",
  "reason": "Brief explanation in 2-3 points",
  "action": "Specific action steps with quantities and timing",
  "risk": "Warning if critical issue detected (or null)",
  "confidence": "Confidence score 0-100"
}}

Keep the response practical and specific to Indian farming conditions."""

    # Step 3: Call Qwen via Ollama
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.3,
                    "format": "json"
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "")
                
                # Parse JSON response
                try:
                    # Extract JSON from response
                    json_start = response_text.find('{')
                    json_end = response_text.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        advice_json = json.loads(response_text[json_start:json_end])
                        advice_json["language"] = language
                        advice_json["confidence_score"] = advice_json.pop("confidence", None)
                        return advice_json
                    else:
                        raise ValueError("No JSON found in response")
                except:
                    # Fallback: return structured response
                    return {
                        "recommendation": "WAIT",
                        "reason": response_text[:200],
                        "action": "Consult local agricultural expert for detailed advice",
                        "risk": None,
                        "confidence_score": 50,
                        "language": language
                    }
            else:
                raise Exception(f"Ollama API error: {response.status_code}")
    
    except httpx.ConnectError:
        # Fallback advice when Ollama is not available
        return get_fallback_advice(sensor_data, crop_type, language)
    except Exception as e:
        print(f"⚠️  Ollama error: {e}")
        return get_fallback_advice(sensor_data, crop_type, language)


def get_fallback_advice(sensor_data: Dict, crop_type: Optional[str], language: str) -> Dict:
    """Provide basic rule-based advice when AI is unavailable"""
    
    recommendations = {
        "hi": {
            "IRRIGATE": "अभी सिंचाई करें - मिट्टी की नमी कम है",
            "WAIT": "प्रतीक्षा करें - मिट्टी की नमी पर्याप्त है",
        },
        "mr": {
            "IRRIGATE": "आज पाणी द्या - मातीची ओलावा कमी आहे",
            "WAIT": "प्रतीक्षा करा - मातीची ओलावा पुरेशी आहे",
        },
        "en": {
            "IRRIGATE": "Irrigate now - soil moisture is low",
            "WAIT": "Wait - soil moisture is adequate",
        }
    }
    
    # Simple rule-based logic
    soil_moisture = sensor_data.get("soil_moisture_root", 500)
    lang_rec = recommendations.get(language, recommendations["en"])
    
    if soil_moisture > 700:  # Dry
        return {
            "recommendation": "IRRIGATE",
            "reason": lang_rec["IRRIGATE"],
            "action": "Apply 500-700 liters per acre using drip irrigation",
            "risk": "Crop stress if irrigation delayed",
            "confidence_score": 70,
            "language": language
        }
    else:
        return {
            "recommendation": "WAIT",
            "reason": lang_rec["WAIT"],
            "action": "Monitor soil moisture in 6-12 hours",
            "risk": None,
            "confidence_score": 75,
            "language": language
        }
