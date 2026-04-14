"""Debug - Check what settings are loading"""
from app.config import settings

print("TWILIO_WHATSAPP_NUMBER from settings:", settings.TWILIO_WHATSAPP_NUMBER)
print("TWILIO_ACCOUNT_SID:", settings.TWILIO_ACCOUNT_SID[:10] + "...")
print("TWILIO_AUTH_TOKEN:", settings.TWILIO_AUTH_TOKEN[:10] + "...")
