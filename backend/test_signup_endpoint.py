import requests
import traceback

try:
    r = requests.post(
        'http://localhost:8000/api/auth/send-signup-otp',
        json={
            'name': 'Himanshu',
            'email': 'gowahe5461@sskaid.com',
            'region': 'Telangana',
            'crops': ['wheat']
        }
    )
    print(f'Status: {r.status_code}')
    print(f'Response: {r.text}')
except Exception as e:
    print(f'Exception: {e}')
    traceback.print_exc()
