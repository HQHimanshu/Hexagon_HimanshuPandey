import asyncio
from app.database import get_db_session
from app.models import OTPVerification
from sqlalchemy import select

async def check():
    async for db in get_db_session():
        result = await db.execute(
            select(OTPVerification)
            .where(OTPVerification.phone == 'gowahe5461@sskaid.com')
            .order_by(OTPVerification.created_at.desc())
        )
        otps = result.scalars().all()
        print(f'Found {len(otps)} OTP records:\n')
        for i, o in enumerate(otps, 1):
            print(f'{i}. OTP="{o.otp_code}" | Created={o.created_at} | Expires={o.expires_at} | Verified={o.is_verified}')
        break

asyncio.run(check())
