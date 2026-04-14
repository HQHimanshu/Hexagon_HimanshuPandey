"""
Test the advice endpoint directly
Run this to verify backend AI advice is working
"""

import httpx
import asyncio

async def test_advice():
    print("🧪 Testing Advice Endpoint...")
    print("=" * 50)
    
    # Step 1: Login
    print("\n1️⃣  Logging in...")
    async with httpx.AsyncClient() as client:
        try:
            # Send OTP
            resp = await client.post(
                "http://localhost:8000/api/auth/send-otp",
                json={"phone": "9876543210"}
            )
            print(f"   OTP sent: {resp.status_code}")
            
            # Verify OTP
            resp = await client.post(
                "http://localhost:8000/api/auth/verify-otp",
                json={"phone": "9876543210", "otp_code": "123456"}
            )
            
            if resp.status_code == 200:
                token = resp.json()["access_token"]
                print(f"   ✅ Logged in! Token: {token[:20]}...")
            else:
                print(f"   ❌ Login failed: {resp.status_code}")
                print(f"   Response: {resp.text[:200]}")
                return
        except Exception as e:
            print(f"   ❌ Auth error: {e}")
            return
        
        # Step 2: Test advice
        print("\n2️⃣  Testing AI advice...")
        import time
        start = time.time()
        
        try:
            resp = await client.post(
                "http://localhost:8000/api/advice",
                headers={"Authorization": f"Bearer {token}"},
                json={"question": "Should I irrigate my wheat crop?"},
                timeout=15.0
            )
            
            elapsed = time.time() - start
            
            if resp.status_code == 200:
                data = resp.json()
                print(f"   ✅ Success! ({elapsed:.2f}s)")
                print(f"   📝 Recommendation: {data.get('recommendation')}")
                print(f"   💡 Reason: {data.get('reason', '')[:100]}")
                print(f"   🎯 Confidence: {data.get('confidence_score')}%")
            else:
                print(f"   ❌ Error: {resp.status_code}")
                print(f"   Response: {resp.text[:300]}")
                
        except httpx.TimeoutException:
            elapsed = time.time() - start
            print(f"   ⏱️  Timeout after {elapsed:.2f}s")
        except Exception as e:
            print(f"   ❌ Request error: {type(e).__name__}: {e}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    asyncio.run(test_advice())
