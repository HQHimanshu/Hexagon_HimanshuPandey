# 🔧 Gmail SMTP Troubleshooting Guide

## Current Status
❌ Gmail is rejecting your App Password with error: `535 5.7.8 BadCredentials`

## Quick Fix Steps

### Step 1: Generate a NEW Gmail App Password

1. **Go to**: https://myaccount.google.com/apppasswords
2. **Sign in** to your Google account (`himanshu.h.pandey@slrtce.in`)
3. **Click**: "Select app" → Choose "Mail"
4. **Click**: "Select device" → Choose "Other (Custom name)" → Enter "KrishiDrishti"
5. **Click**: "Generate"
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
7. **IMPORTANT**: Remove all spaces when adding to .env file!

### Step 2: Update Your .env File

```env
SMTP_EMAIL=himanshu.h.pandey@slrtce.in
SMTP_PASSWORD=abcdefghijklmnop
```

**Note**: NO SPACES in the password! The example above should be:
```
SMTP_PASSWORD=abcdefghijklmnop
```

### Step 3: Test Again

```bash
cd backend
python test_otp_delivery.py
```

## Alternative Solutions

### Option A: Use a Different Email Provider
If Gmail continues to fail, try:
- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port 587
- **Yahoo Mail**: `smtp.mail.yahoo.com`, port 587

### Option B: Enable "Less Secure App Access" (If Available)
1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Try again with your regular Gmail password

### Option C: Use Your College Email
Since you're using `@slrtce.in`, check if:
- Your college has its own SMTP server
- You can get SMTP credentials from IT department

## Common Issues

### Issue 1: Password Has Spaces
**Wrong**: `SMTP_PASSWORD=abcd efgh ijkl mnop`
**Right**: `SMTP_PASSWORD=abcdefghijklmnop`

### Issue 2: Using Regular Gmail Password
You MUST use an App Password, not your regular Gmail password.

### Issue 3: 2-Step Verification Not Enabled
App Passwords require 2-Step Verification to be enabled first.

## Test Commands

After updating .env:
```bash
cd backend
python test_otp_delivery.py
```

Expected output:
```
📧 Testing Email OTP...
✅ Email OTP sent to himanshu.h.pandey@slrtce.in
Status: SENT
```
