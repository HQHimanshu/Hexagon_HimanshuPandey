"""Test Ollama directly"""
import asyncio
import httpx
from app.config import settings

async def test_ollama():
    print(f"Testing Ollama at: {settings.OLLAMA_BASE_URL}")
    print(f"Model: {settings.OLLAMA_MODEL}")
    
    prompt = "What causes yellow leaves in rice crops? Answer in 2 sentences."
    
    print(f"\nPrompt: {prompt}")
    print("\nSending request...")
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.3
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n✅ Response: {data.get('response', 'NO RESPONSE')[:200]}")
            else:
                print(f"\n❌ Status: {response.status_code}")
                print(f"Error: {response.text}")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_ollama())
