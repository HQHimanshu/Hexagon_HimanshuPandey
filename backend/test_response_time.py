"""
Test script to verify API response time
Run this after starting the backend
"""

import requests
import time

BASE_URL = "http://localhost:8000"

def test_response_time():
    """Test if advice endpoint responds quickly"""
    
    print("🧪 Testing AI Advice Response Time...")
    print("=" * 50)
    
    # First, login to get token
    print("\n1️⃣  Logging in...")
    try:
        login_response = requests.post(
            f"{BASE_URL}/api/auth/send-otp",
            json={"phone": "9876543210"}
        )
        print(f"   ✅ OTP sent (or backend not running: {login_response.status_code})")
        
        verify_response = requests.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json={"phone": "9876543210", "otp_code": "123456"}
        )
        
        if verify_response.status_code == 200:
            token = verify_response.json()["access_token"]
            print(f"   ✅ Logged in successfully")
        else:
            print(f"   ⚠️  Login failed, using test token")
            token = "test-token"
            
    except Exception as e:
        print(f"   ⚠️  Auth error: {e}")
        token = "test-token"
    
    # Test advice endpoint
    print("\n2️⃣  Testing AI advice endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    test_questions = [
        "Should I irrigate my wheat crop?",
        "What fertilizer should I use?",
        "Is the weather good for harvesting?"
    ]
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n   Test {i}: {question}")
        
        start_time = time.time()
        try:
            response = requests.post(
                f"{BASE_URL}/api/advice",
                headers=headers,
                json={"question": question},
                timeout=15  # 15 second timeout
            )
            
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Response in {elapsed:.2f}s")
                print(f"   📝 Recommendation: {data.get('recommendation', 'N/A')}")
                print(f"   🎯 Confidence: {data.get('confidence_score', 'N/A')}%")
                
                if elapsed < 5:
                    print(f"   🚀 EXCELLENT: Very fast response!")
                elif elapsed < 10:
                    print(f"   ⚡ GOOD: Acceptable speed")
                else:
                    print(f"   ⚠️  SLOW: Took more than 10 seconds")
            else:
                print(f"   ❌ Error: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                
        except requests.Timeout:
            elapsed = time.time() - start_time
            print(f"   ❌ TIMEOUT after {elapsed:.2f}s")
            print(f"   💡 Backend is too slow, check Ollama")
        except Exception as e:
            print(f"   ❌ Request failed: {e}")
    
    # Test knowledge stats
    print("\n3️⃣  Testing knowledge base...")
    try:
        response = requests.get(f"{BASE_URL}/api/knowledge/stats")
        if response.status_code == 200:
            stats = response.json()
            print(f"   ✅ Total documents: {stats.get('total_documents', 0)}")
            print(f"   📁 Files: {stats.get('document_processor_stats', {})}")
        else:
            print(f"   ⚠️  Stats not available")
    except Exception as e:
        print(f"   ⚠️  Knowledge stats error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Test complete!")
    print("\n💡 If responses took >10 seconds:")
    print("   - Check if Ollama is running: ollama list")
    print("   - Try smaller model: ollama pull qwen2.5:0.5b")
    print("   - Restart backend and try again")

if __name__ == "__main__":
    test_response_time()
