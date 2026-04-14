"""
Test script to verify Twilio WhatsApp API credentials are working.
Run this to check if your Twilio account can send WhatsApp messages.
"""
import sys
from app.config import settings

# Get Twilio credentials from settings
TWILIO_ACCOUNT_SID = settings.TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN = settings.TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER = settings.TWILIO_WHATSAPP_NUMBER

print("=" * 60)
print("🔍 KrishiDrishti - Twilio WhatsApp API Key Test")
print("=" * 60)

# Check if credentials are set
print("\n📋 Checking Twilio credentials...")
print(f"✅ TWILIO_ACCOUNT_SID: {TWILIO_ACCOUNT_SID[:10]}..." if TWILIO_ACCOUNT_SID else "❌ TWILIO_ACCOUNT_SID: NOT SET")
print(f"✅ TWILIO_AUTH_TOKEN: {TWILIO_AUTH_TOKEN[:10]}..." if TWILIO_AUTH_TOKEN else "❌ TWILIO_AUTH_TOKEN: NOT SET")
print(f"✅ TWILIO_WHATSAPP_NUMBER: {TWILIO_WHATSAPP_NUMBER}" if TWILIO_WHATSAPP_NUMBER else "❌ TWILIO_WHATSAPP_NUMBER: NOT SET")

if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
    print("\n❌ ERROR: Twilio credentials are not set in .env file!")
    print("Please add your Twilio API keys to backend/.env")
    sys.exit(1)

# Try to import and initialize Twilio client
print("\n📦 Initializing Twilio client...")
try:
    from twilio.rest import Client
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    print("✅ Twilio client initialized successfully!")
except Exception as e:
    print(f"❌ ERROR: Failed to initialize Twilio client: {e}")
    sys.exit(1)

# Test sending a WhatsApp message
print("\n" + "=" * 60)
print("📱 TEST MODE - Send Test WhatsApp Message")
print("=" * 60)

# Ask for test phone number
test_phone = input("\nEnter your phone number (with country code, e.g., +919876543210): ").strip()

if not test_phone.startswith('+'):
    test_phone = f"+91{test_phone}"

print(f"\n📤 Sending test message to: {test_phone}")
print(f"📥 From: whatsapp:{TWILIO_WHATSAPP_NUMBER}")

try:
    message = client.messages.create(
        from_=f"whatsapp:{TWILIO_WHATSAPP_NUMBER}",
        body="🌾 KrishiDrishti Test Message\n\n✅ Your Twilio WhatsApp API is working correctly!\n\nYou will receive OTP codes here when logging in.",
        to=f"whatsapp:{test_phone}"
    )
    
    print(f"\n✅ SUCCESS! Message sent!")
    print(f"📬 Message SID: {message.sid}")
    print(f"🔗 Status: {message.status}")
    print("\nCheck your WhatsApp - you should have received the test message!")
    
except Exception as e:
    print(f"\n❌ ERROR: Failed to send message: {e}")
    print("\nTroubleshooting tips:")
    print("1. Make sure your Twilio account is active")
    print("2. Check if you have sufficient Twilio credits")
    print("3. Verify the WhatsApp number is approved in your Twilio console")
    print("4. For sandbox testing, the recipient must join the sandbox first")
    print("   Visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn")

print("\n" + "=" * 60)
print("Test complete!")
print("=" * 60)
