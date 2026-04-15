"""
Complete Authentication Flow Test
Tests the entire login -> OTP verification -> redirect -> dashboard access flow
"""
import asyncio
import httpx
from app.database import get_db_session
from app.models import User, OTPVerification
from sqlalchemy import select

BASE_URL = "http://localhost:8000/api"

async def test_complete_auth_flow():
    print("=" * 70)
    print("🧪 Testing Complete Authentication Flow")
    print("=" * 70)

    test_email = "test_auth_flow@example.com"
    
    async with httpx.AsyncClient() as client:
        
        # Step 1: Create user if not exists
        print("\n📝 Step 1: Creating test user...")
        try:
            async for db in get_db_session():
                result = await db.execute(select(User).where(User.email == test_email))
                existing_user = result.scalar_one_or_none()
                
                if not existing_user:
                    new_user = User(
                        email=test_email,
                        name="Test User",
                        region="Maharashtra",
                        crops=["Rice", "Wheat"],
                        language="en"
                    )
                    db.add(new_user)
                    await db.commit()
                    await db.refresh(new_user)
                    print(f"   ✅ User created with id={new_user.id}")
                else:
                    print(f"   ✅ User already exists with id={existing_user.id}")
                break
        except Exception as e:
            print(f"   ❌ Failed to create user: {e}")
            return

        # Step 2: Send OTP
        print("\n📤 Step 2: Sending OTP...")
        try:
            response = await client.post(
                f"{BASE_URL}/auth/send-email-otp",
                json={"email": test_email}
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print(f"   ✅ OTP sent successfully")
                print(f"   Response: {response.json()}")
            else:
                print(f"   ❌ Failed to send OTP: {response.text}")
                return
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return

        # Step 3: Get the OTP from database
        print("\n🔍 Step 3: Retrieving OTP from database...")
        try:
            async for db in get_db_session():
                result = await db.execute(
                    select(OTPVerification)
                    .where(OTPVerification.phone == test_email)
                    .order_by(OTPVerification.created_at.desc())
                )
                otp_records = result.scalars().all()
                
                if otp_records:
                    otp_code = otp_records[0].otp_code
                    print(f"   ✅ OTP found: {otp_code}")
                else:
                    print(f"   ❌ No OTP found in database")
                    return
                break
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return

        # Step 4: Verify OTP
        print("\n✅ Step 4: Verifying OTP...")
        try:
            response = await client.post(
                f"{BASE_URL}/auth/verify-email-otp",
                json={
                    "email": test_email,
                    "otp_code": otp_code
                }
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ OTP verified successfully")
                print(f"   Access token: {data['access_token'][:30]}...")
                print(f"   User: {data['user']['name']} ({data['user']['email']})")
                
                access_token = data['access_token']
            else:
                print(f"   ❌ OTP verification failed: {response.text}")
                return
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return

        # Step 5: Access protected endpoint with token
        print("\n🔐 Step 5: Accessing protected endpoint with token...")
        try:
            response = await client.get(
                f"{BASE_URL}/dashboard/metrics",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                print(f"   ✅ Dashboard metrics accessed successfully")
            else:
                print(f"   ❌ Access denied: {response.text}")
        except Exception as e:
            print(f"   ❌ Error: {e}")

    print("\n" + "=" * 70)
    print("✅ Authentication Flow Test Complete!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(test_complete_auth_flow())
