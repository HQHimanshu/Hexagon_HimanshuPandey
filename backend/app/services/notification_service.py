import aiosmtplib
from email.message import EmailMessage
from typing import Optional
from twilio.rest import Client
from gtts import gTTS
import os
from app.config import settings
from app.utils.translations import get_alert_message
from app.models import User


# Twilio client (initialized lazily)
_twilio_client = None


def get_twilio_client():
    global _twilio_client
    if _twilio_client is None and settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        _twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    return _twilio_client


async def send_alert(user: User, message_key: str, data: dict = None) -> dict:
    """Send alert via user's preferred channels with regional language"""
    
    if data is None:
        data = {}
    
    # Fetch translations
    message_en = get_alert_message(message_key, "en")
    message_hi = get_alert_message(message_key, "hi")
    message_mr = get_alert_message(message_key, "mr")
    
    # Get message in user's language
    message = {
        "en": message_en,
        "hi": message_hi,
        "mr": message_mr
    }.get(user.language, message_en)
    
    results = {
        "whatsapp": None,
        "sms": None,
        "email": None,
        "voice": None
    }
    
    # Send via WhatsApp
    if user.whatsapp_opt_in and settings.TWILIO_ACCOUNT_SID:
        try:
            results["whatsapp"] = await send_whatsapp(user.phone, message)
        except Exception as e:
            results["whatsapp"] = {"status": "FAILED", "error": str(e)}
    
    # Send via SMS
    if user.sms_opt_in and settings.TWILIO_ACCOUNT_SID:
        try:
            results["sms"] = await send_sms(user.phone, message)
        except Exception as e:
            results["sms"] = {"status": "FAILED", "error": str(e)}
    
    # Send via Email
    if user.email and user.email_opt_in:
        try:
            results["email"] = await send_email(user.email, message)
        except Exception as e:
            results["email"] = {"status": "FAILED", "error": str(e)}
    
    # Send Voice Alert
    if user.voice_opt_in and settings.VOICE_ALERT_ENABLED:
        try:
            results["voice"] = await send_voice_alert(user.phone, message, user.language)
        except Exception as e:
            results["voice"] = {"status": "FAILED", "error": str(e)}
    
    return results


async def send_whatsapp(phone: str, message: str) -> dict:
    """Send WhatsApp message via Twilio"""
    client = get_twilio_client()
    
    if client is None:
        # Mock for development
        print(f"📱 [MOCK WhatsApp] To: {phone} | Message: {message}")
        return {"status": "MOCK_SENT", "phone": phone}
    
    try:
        message_obj = client.messages.create(
            from_=f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
            body=message,
            to=f"whatsapp:+91{phone.lstrip('+91')}"
        )
        return {"status": "SENT", "sid": message_obj.sid}
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}


async def send_sms(phone: str, message: str) -> dict:
    """Send SMS via Twilio"""
    client = get_twilio_client()
    
    if client is None:
        # Mock for development
        print(f"📱 [MOCK SMS] To: {phone} | Message: {message}")
        return {"status": "MOCK_SENT", "phone": phone}
    
    try:
        message_obj = client.messages.create(
            body=message,
            from_="+1234567890",  # Your Twilio number
            to=f"+91{phone.lstrip('+91')}"
        )
        return {"status": "SENT", "sid": message_obj.sid}
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}


async def send_email(email: str, message: str) -> dict:
    """Send email via SMTP"""
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        print(f"📧 [MOCK Email] To: {email} | Message: {message}")
        return {"status": "MOCK_SENT", "email": email}
    
    try:
        msg = EmailMessage()
        msg["Subject"] = "KrishiDrishti Alert - कृषिदृष्टि सूचना"
        msg["From"] = settings.SMTP_EMAIL
        msg["To"] = email
        msg.set_content(message)
        
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_SERVER,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_EMAIL,
            password=settings.SMTP_PASSWORD
        )
        
        return {"status": "SENT"}
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}


async def send_voice_alert(phone: str, message: str, language: str = "hi") -> dict:
    """Generate and send voice alert using gTTS"""
    try:
        # Create voice file
        lang_code = {
            "hi": "hi",
            "mr": "hi",  # Marathi uses Hindi voice as fallback
            "en": "en"
        }.get(language, "hi")
        
        tts = gTTS(text=message, lang=lang_code, slow=False)
        
        # Save to temp file
        temp_file = f"/tmp/voice_alert_{phone}.mp3"
        tts.save(temp_file)
        
        # In production, you would upload to a server and send SMS with link
        # For now, just log
        print(f"🔊 [Voice Alert] Generated: {temp_file}")
        print(f"   Message: {message}")
        
        return {"status": "GENERATED", "file": temp_file}
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}


async def send_test_alert(channel: str = "all") -> dict:
    """Send test alert to verify notification system"""
    test_message = "KrishiDrishti test alert - कृषिदृष्टि परीक्षण सूचना"
    
    results = {}
    
    if channel in ["whatsapp", "all"]:
        results["whatsapp"] = await send_whatsapp("+919876543210", test_message)
    
    if channel in ["sms", "all"]:
        results["sms"] = await send_sms("+919876543210", test_message)
    
    if channel in ["email", "all"]:
        results["email"] = await send_email("test@example.com", test_message)
    
    if channel in ["voice", "all"]:
        results["voice"] = await send_voice_alert("+919876543210", test_message, "hi")
    
    return results
