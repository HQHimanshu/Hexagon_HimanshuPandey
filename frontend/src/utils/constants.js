// App-wide constants

export const APP_NAME = 'KrishiDrishti'
export const APP_VERSION = '1.0.0'

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  hi: { name: 'हिंदी', flag: '🇮🇳' },
  mr: { name: 'मराठी', flag: '🇮🇳' }
}

export const CROP_TYPES = [
  { value: 'wheat', label: 'Wheat', icon: '🌾' },
  { value: 'rice', label: 'Rice', icon: '🌾' },
  { value: 'cotton', label: 'Cotton', icon: '🌿' },
  { value: 'sugarcane', label: 'Sugarcane', icon: '🌱' },
  { value: 'maize', label: 'Maize', icon: '🌽' },
  { value: 'soybean', label: 'Soybean', icon: '🫘' },
  { value: 'vegetables', label: 'Vegetables', icon: '🥬' }
]

export const RECOMMENDATION_TYPES = {
  IRRIGATE: { label: 'Irrigate Now', icon: '💧', color: 'blue' },
  WAIT: { label: 'Wait', icon: '⏸️', color: 'yellow' },
  FERTILIZE: { label: 'Fertilize', icon: '🌱', color: 'green' },
  HARVEST: { label: 'Harvest', icon: '🌾', color: 'amber' },
  PEST_CONTROL: { label: 'Pest Control', icon: '🐛', color: 'red' },
  DISEASE_TREATMENT: { label: 'Disease Treatment', icon: '💊', color: 'red' }
}

export const ALERT_TYPES = {
  CRITICAL: { label: 'Critical', color: 'red', icon: '🚨' },
  WARNING: { label: 'Warning', color: 'yellow', icon: '⚠️' },
  INFO: { label: 'Info', color: 'blue', icon: 'ℹ️' }
}

export const ALERT_CHANNELS = {
  whatsapp: { label: 'WhatsApp', icon: '📱' },
  sms: { label: 'SMS', icon: '💬' },
  email: { label: 'Email', icon: '📧' },
  voice: { label: 'Voice', icon: '🔊' }
}

export const SENSOR_RANGES = {
  temperature: { min: -10, max: 60, unit: '°C' },
  humidity: { min: 0, max: 100, unit: '%' },
  soil_moisture: { min: 0, max: 1023, unit: 'ADC' },
  ph_level: { min: 0, max: 14, unit: 'pH' },
  water_tank: { min: 0, max: 100, unit: '%' }
}

export const WATER_BUDGET_PER_ACRE = 10000 // liters per week
export const FERTILIZER_BUDGET_PER_ACRE = 5000 // grams per week

export const DEFAULT_LOCATION = {
  lat: 21.1458, // Nagpur, Maharashtra
  lng: 79.0882
}

export const SYNC_INTERVAL = 30000 // 30 seconds
export const SENSOR_UPDATE_INTERVAL = 60000 // 1 minute
