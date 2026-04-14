"""Debug OTP verification issue"""
import asyncio
from app.database import get_db_session
from app.models import OTPVerification
from sqlalchemy import select

async def debug_otp():
    async for db in get_db_session():
        result = await db.execute(
            select(OTPVerification)
            .order_by(OTPVerification.created_at.desc())
            .limit(5)
        )
        otps = result.scalars().all()
        
        print(f"Found {len(otps)} recent OTP records:\n")
        for otp in otps:
            print(f"Email/Phone: {otp.phone}")
            print(f"OTP Code: {otp.otp_code}")
            print(f"Created: {otp.created_at}")
            print(f"Expires: {otp.expires_at}")
            print(f"Verified: {otp.is_verified}")
            print(f"Expired: {otp.expires_at < otp.created_at}")
            print("---")
        
        break

if __name__ == "__main__":
    asyncio.run(debug_otp())
