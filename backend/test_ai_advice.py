"""
Test Qwen 2.5 AI Advice Pipeline
Tests the complete flow from backend to Ollama model
"""
import asyncio
import httpx

async def test_ai_advice():
    print("=" * 60)
    print("🤖 Testing Qwen 2.5 AI Advice Pipeline")
    print("=" * 60)
    
    # Test question
    question = "My rice crop leaves are turning yellow. What should I do?"
    
    print(f"\n❓ Question: {question}")
    print("\n⏳ Sending to AI model...")
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(
                "http://localhost:8000/api/advice/",
                json={
                    "question": question,
                    "sensor_data": {
                        "temperature": 32,
                        "humidity": 75,
                        "soil_moisture": 60
                    }
                }
            )
            
            print(f"\n📊 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("\n✅ AI Response Received!")
                print(f"\n💡 Recommendation:")
                print(data.get('recommendation', 'N/A'))
                print(f"\n📝 Reason:")
                print(data.get('reason', 'N/A'))
                print(f"\n🔧 Action:")
                print(data.get('action', 'N/A'))
            else:
                print(f"\n❌ Error: {response.text[:200]}")
                
        except Exception as e:
            print(f"\n❌ Failed: {e}")
    
    print("\n" + "=" * 60)
    print("Test Complete")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_ai_advice())
