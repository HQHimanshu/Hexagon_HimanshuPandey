// Validation utilities

export const validatePhone = (phone) => {
  // Remove spaces, dashes, and plus sign
  const cleaned = phone.replace(/[\s\-\+]/g, '')
  // Indian phone number validation: 10 digits, starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/
  // Also allow international format with country code
  const intlRegex = /^(91)?[6-9]\d{9}$/
  
  return phoneRegex.test(cleaned) || intlRegex.test(cleaned)
}

export const validateOTP = (otp) => {
  // OTP should be exactly 6 digits
  return /^\d{6}$/.test(otp)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateLocation = (lat, lng) => {
  const latNum = parseFloat(lat)
  const lngNum = parseFloat(lng)
  
  if (isNaN(latNum) || isNaN(lngNum)) return false
  if (latNum < -90 || latNum > 90) return false
  if (lngNum < -180 || lngNum > 180) return false
  
  return true
}

export const validateFarmArea = (area) => {
  const areaNum = parseFloat(area)
  return !isNaN(areaNum) && areaNum > 0 && areaNum < 10000
}

export const validateCropType = (cropType) => {
  const validCrops = ['wheat', 'rice', 'cotton', 'sugarcane', 'maize', 'soybean', 'vegetables']
  return validCrops.includes(cropType)
}

export const validateSensorValue = (type, value) => {
  const numValue = parseFloat(value)
  
  if (isNaN(numValue)) return false
  
  const ranges = {
    temperature: { min: -10, max: 60 },
    humidity: { min: 0, max: 100 },
    soil_moisture: { min: 0, max: 1023 },
    ph_level: { min: 0, max: 14 },
    water_tank: { min: 0, max: 100 }
  }
  
  const range = ranges[type]
  if (!range) return true // Unknown type, allow
  
  return numValue >= range.min && numValue <= range.max
}

export const sanitizeInput = (input) => {
  // Remove potentially dangerous HTML/script tags
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
