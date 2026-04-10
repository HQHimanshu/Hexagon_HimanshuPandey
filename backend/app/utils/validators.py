import re
from typing import Optional


def validate_phone(phone: str) -> bool:
    """Validate Indian phone number"""
    pattern = r'^\+91[6-9]\d{9}$|^[6-9]\d{9}$'
    return bool(re.match(pattern, phone))


def sanitize_input(text: str) -> str:
    """Remove potentially harmful characters from input"""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove special characters that could be used for injection
    text = re.sub(r'[<>\'";\\]', '', text)
    return text.strip()


def validate_coordinates(lat: Optional[float], lng: Optional[float]) -> bool:
    """Validate latitude and longitude coordinates"""
    if lat is None or lng is None:
        return True  # Optional fields
    return -90 <= lat <= 90 and -180 <= lng <= 180


def validate_crop_type(crop_type: Optional[str]) -> bool:
    """Validate crop type against known crops"""
    if crop_type is None:
        return True
    valid_crops = ["wheat", "rice", "cotton", "sugarcane", "maize", "soybean", "vegetables"]
    return crop_type.lower() in valid_crops
