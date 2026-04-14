"""
Test actual OTP delivery via WhatsApp and Email
"""
import asyncio
from app.config import settings
from app.services.notification_service import send_whatsapp, send_email_otp

TEST_PHONE = "+918626081052"
TEST_EMAIL = "himanshu.h.pandey@slrtce.in"
TEST_OTP = "123456"

async def test_otp_delivery():
    print("=" * 60)
    print("🧪 Testing Actual OTP Delivery")
    print("=" * 60)
    
    # Test WhatsApp OTP
    print("\n📱 Testing WhatsApp OTP...")
    print(f"   To: {TEST_PHONE}")
    print(f"   From: {settings.TWILIO_WHATSAPP_NUMBER}")
    
    whatsapp_message = f"🌾 *KrishiDrishti OTP Verification*\n\nYour OTP code is: *{TEST_OTP}*\n\nThis code expires in 5 minutes."
    
    try:
        result = await send_whatsapp(TEST_PHONE, whatsapp_message)
        print(f"   Status: {result.get('status')}")
        if result.get('sid'):
            print(f"   ✅ WhatsApp SID: {result['sid']}")
        else:
            print(f"   ⚠️ Response: {result}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test Email OTP
    print("\n📧 Testing Email OTP...")
    print(f"   To: {TEST_EMAIL}")
    print(f"   From: {settings.SMTP_EMAIL}")
    
    try:
        result = await send_email_otp(TEST_EMAIL, TEST_OTP)
        print(f"   Status: {result.get('status')}")
        if result.get('status') == 'SENT':
            print(f"   ✅ Email OTP sent successfully!")
        else:
            print(f"   ⚠️ Response: {result}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("Test Complete!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_otp_delivery())
