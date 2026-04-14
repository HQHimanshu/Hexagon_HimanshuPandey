"""Check Twilio account for available phone numbers"""
from app.config import settings
from twilio.rest import Client

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

print("🔍 Checking your Twilio account for WhatsApp-capable numbers...\n")

# Get all incoming phone numbers
numbers = client.incoming_phone_numbers.list()

print(f"📞 Found {len(numbers)} phone number(s) in your account:\n")

for num in numbers:
    print(f"  Number: {num.phone_number}")
    print(f"  SID: {num.sid}")
    print(f"  Voice: {'✅' if num.voice_url else '❌'}")
    print(f"  SMS: {'✅' if num.sms_url else '❌'}")
    print()

# Check WhatsApp sandbox
print("\n💡 For WhatsApp testing:")
print("1. If using sandbox, use: from_='whatsapp:+14155238886'")
print("2. Recipients must join the sandbox first")
print("3. Visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")

# Try with sandbox number
print("\n📤 Trying with Twilio WhatsApp sandbox (+14155238886)...")
try:
    message = client.messages.create(
        from_='whatsapp:+14155238886',
        body="🌾 *KrishiDrishti Test*\n\nThis is a test from the sandbox.",
        to='whatsapp:+918626081052'
    )
    print(f"✅ Sandbox test succeeded! SID: {message.sid}")
except Exception as e:
    error_msg = str(e)
    if "participant" in error_msg.lower() or "join" in error_msg.lower():
        print(f"❌ Recipient hasn't joined the sandbox yet.")
        print(f"   Ask them to send 'join <any-word>' to +14155238886 on WhatsApp")
    else:
        print(f"❌ Sandbox test failed: {e}")
