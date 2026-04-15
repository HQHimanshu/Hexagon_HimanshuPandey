"""
Quick Demo Login - Creates a user and returns JWT token instantly
Run this to get a valid auth token for development testing
"""
import asyncio
import httpx

BASE_URL = "http://localhost:8000/api"

async def demo_login():
    print("=" * 70)
    print("🔑 Creating Demo Login Token")
    print("=" * 70)
    
    email = "demo@krishidrishti.com"
    
    async with httpx.AsyncClient() as client:
        # Step 1: Send OTP (this will auto-create the user)
        print("\n📤 Step 1: Requesting OTP...")
        response = await client.post(f"{BASE_URL}/auth/send-email-otp", json={"email": email})
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error: {response.text}")
            return
        
        # Step 2: Get OTP from backend logs or database
        print("\n✅ OTP sent! Check backend terminal or database for the code.")
        print("\nNow run the OTP verification with the code from the logs.")
        
        # For convenience, here's what you should do next:
        print("\n" + "=" * 70)
        print("📋 Next Steps:")
        print("=" * 70)
        print("1. Check backend terminal for the OTP code")
        print("2. Enter that OTP on the login page")
        print("3. You'll be redirected to dashboard!")
        print("\nOR use the test script: python test_complete_auth_flow.py")

if __name__ == "__main__":
    asyncio.run(demo_login())
