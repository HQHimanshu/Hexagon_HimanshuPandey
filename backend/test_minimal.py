"""Minimal test to see actual error"""
import requests
import json

url = "http://localhost:8000/api/auth/verify-signup-otp"
payload = {
    "email": "himanshu.h.pandey@slrtce.in",
    "otp_code": "123456",
    "name": "Test User",
    "region": "Maharashtra",
    "crops": ["Rice"]
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print(f"Headers: {dict(response.headers)}")
except Exception as e:
    print(f"Exception: {e}")
    import traceback
    traceback.print_exc()
