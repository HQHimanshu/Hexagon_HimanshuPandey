from typing import Optional
import json


def format_sensor_data(
    temperature: Optional[float] = None,
    humidity: Optional[float] = None,
    soil_moisture: Optional[float] = None
) -> str:
    """Format sensor data for display"""
    parts = []
    if temperature is not None:
        parts.append(f"🌡️ {temperature:.1f}°C")
    if humidity is not None:
        parts.append(f"💧 {humidity:.1f}%")
    if soil_moisture is not None:
        parts.append(f"🌱 {soil_moisture:.0f}")
    return " | ".join(parts)


def calculate_moisture_percentage(adc_value: float) -> float:
    """Convert ADC value (0-1023) to moisture percentage"""
    # 0 = fully wet, 1023 = fully dry (typical for soil moisture sensors)
    return max(0, min(100, (1 - adc_value / 1023) * 100))


def get_ph_status(ph: float) -> str:
    """Get pH status description"""
    if ph < 5.5:
        return "highly_acidic"
    elif ph < 6.5:
        return "slightly_acidic"
    elif ph <= 7.5:
        return "neutral"
    elif ph <= 8.5:
        return "slightly_alkaline"
    else:
        return "highly_alkaline"


def format_bytes(bytes_val: int) -> str:
    """Format bytes to human readable"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_val < 1024.0:
            return f"{bytes_val:.1f} {unit}"
        bytes_val /= 1024.0
    return f"{bytes_val:.1f} TB"


def parse_json_safely(json_str: str, default=None):
    """Safely parse JSON string"""
    if default is None:
        default = {}
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default
