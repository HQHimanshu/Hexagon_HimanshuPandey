# 🔐 KrishiDrishti - OTP Setup Guide

## Current Status
✅ **Email OTP** - Ready (needs Gmail App Password)
⚠️ **WhatsApp OTP** - Needs Twilio WhatsApp Sandbox activation

---

## 📧 Step 1: Fix Gmail OTP (CRITICAL)

Your Gmail password needs to be an **App Password**, not your regular Gmail password.

### How to Generate Gmail App Password:

1. Go to your Google Account: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and your device
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
7. Update your `.env` file:
   ```
   SMTP_PASSWORD=abcdefghijklmnop
   ```
   (Remove spaces from the app password)

### Test Email OTP:
```bash
cd backend
python test_otp_delivery.py
```

---

## 📱 Step 2: Activate Twilio WhatsApp Sandbox

Your Twilio number `+17754753657` needs the recipient to join the sandbox first.

### How to Activate:

1. **Open WhatsApp** on your phone (`+918626081052`)
2. **Send this message** to `+17754753657`:
   ```
   join krishidrishti
   ```
3. You'll receive a confirmation message
4. Now you can receive OTP codes!

### Alternative: Get Your Own Sandbox Number

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. You'll see your personal sandbox number
3. Send `join <any-word>` to that number
4. Update `.env` with your sandbox number:
   ```
   TWILIO_WHATSAPP_NUMBER=+14155238886
   ```

---

## 🧪 Step 3: Test Everything

### Test Email OTP:
```bash
cd backend
python test_otp_delivery.py
```

### Test WhatsApp OTP:
After joining sandbox, run the same test.

### Test Full Signup Flow:
1. Start backend: `python run.py`
2. Start frontend: `npm run dev`
3. Go to: http://localhost:5173/login
4. Try signup with your email

---

## 🔄 Current OTP Behavior

### Email OTP:
- ✅ If SMTP configured: Real email sent
- ⚠️ If SMTP not configured: OTP shown in backend console

### WhatsApp OTP:
- ✅ If WhatsApp configured & sandbox joined: Real WhatsApp sent
- ⚠️ If not configured: OTP shown in backend console

**Both have fallback to console mode for development!**

---

## 📊 User Account & History

The system now maintains:
- ✅ User accounts with email as unique identifier
- ✅ OTP verification history in database
- ✅ User profile (name, email, phone, region, crops)
- ✅ Welcome alerts on signup
- ✅ Session management with JWT tokens

---

## 🚀 Quick Start (Working Now)

Even without WhatsApp/Email setup, you can test:

1. **Backend console shows OTP** when delivery fails
2. **Frontend alert shows OTP** for testing
3. Full signup/login flow works

Just check the backend terminal for OTP codes like:
```
📧 [MOCK EmailOTP] To: user@example.com | OTP: 123456
📱 [MOCK WhatsApp] To: +918626081052 | OTP: 123456
```
