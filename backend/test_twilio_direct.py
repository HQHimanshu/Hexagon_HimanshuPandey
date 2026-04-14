"""Direct test of Twilio WhatsApp"""
from app.config import settings
from twilio.rest import Client

print("🔍 Testing Twilio WhatsApp directly...")
print(f"Account SID: {settings.TWILIO_ACCOUNT_SID}")
print(f"Auth Token: {settings.TWILIO_AUTH_TOKEN[:10]}...")
print(f"WhatsApp Number: {settings.TWILIO_WHATSAPP_NUMBER}")

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

TEST_PHONE = "+918626081052"
message_text = "🌾 KrishiDrishti Test - WhatsApp is working!"

print(f"\n📤 Sending to: {TEST_PHONE}")
print(f"From: whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}")

try:
    message = client.messages.create(
        from_=f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
        body=message_text,
        to=f"whatsapp:{TEST_PHONE}"
    )
    print(f"✅ SUCCESS!")
    print(f"SID: {message.sid}")
    print(f"Status: {message.status}")
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 This usually means:")
    print("1. The recipient hasn't joined the WhatsApp sandbox")
    print("2. The number isn't a verified WhatsApp Business API number")
    print("\nTo fix:")
    print("- Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")
    print("- Have the recipient send 'join <word>' to the sandbox number on WhatsApp")
