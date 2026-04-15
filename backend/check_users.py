import asyncio
from app.database import get_db_session
from app.models import User
from sqlalchemy import select

async def check_users():
    print("=" * 70)
    print("👥 Users in Database")
    print("=" * 70)
    
    async for db in get_db_session():
        result = await db.execute(select(User).order_by(User.id))
        users = result.scalars().all()
        
        if not users:
            print("\n❌ No users found in database!")
        else:
            print(f"\n✅ Found {len(users)} user(s):\n")
            for i, user in enumerate(users, 1):
                print(f"{i}. ID: {user.id}")
                print(f"   Email: {user.email}")
                print(f"   Name: {user.name}")
                print(f"   Region: {user.region}")
                print(f"   Created: {user.created_at}")
                print()
        break

asyncio.run(check_users())
