"""Direct env file test"""
from pathlib import Path
import os

env_path = Path(__file__).parent / ".env"
print(f"Looking for .env at: {env_path}")
print(f"File exists: {env_path.exists()}")

if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if 'TWILIO' in line:
                print(line.strip())

# Try loading with python-dotenv directly
from dotenv import dotenv_values
values = dotenv_values(env_path)
print("\nFrom dotenv_values:")
print(f"TWILIO_WHATSAPP_NUMBER: {values.get('TWILIO_WHATSAPP_NUMBER')}")
print(f"TWILIO_ACCOUNT_SID: {values.get('TWILIO_ACCOUNT_SID')}")
