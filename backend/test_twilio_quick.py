"""Quick test - Send WhatsApp message to verify Twilio works"""
from app.config import settings
from twilio.rest import Client

TEST_PHONE = "+918626081052"

print(f"📤 Sending test WhatsApp to: {TEST_PHONE}")
print(f"📱 From: {settings.TWILIO_WHATSAPP_NUMBER}")

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

try:
    # Try with sandbox prefix format
    message = client.messages.create(
        from_=f"whatsapp:+{settings.TWILIO_WHATSAPP_NUMBER.lstrip('+')}",
        body="🌾 *KrishiDrishti Test*\n\n✅ Twilio WhatsApp is working! You'll receive OTP codes here.",
        to=f"whatsapp:{TEST_PHONE}"
    )
    print(f"✅ Success! SID: {message.sid}")
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n⚠️ Note: For Twilio WhatsApp sandbox, you need to:")
    print("1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")
    print("2. Join the sandbox by sending 'join <your-word' to +14155238886")
    print("3. Or use your approved Twilio WhatsApp number")
