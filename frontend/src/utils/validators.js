// Form validation utilities

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateNumber = (value, min, max) => {
  const num = parseFloat(value)
  return !isNaN(num) && num >= min && num <= max
}

export const validateRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return !isNaN(value)
  return value !== null && value !== undefined
}

export const getSensorValidation = (type, value) => {
  const ranges = {
    temperature: { min: -10, max: 60 },
    humidity: { min: 0, max: 100 },
    soil_moisture: { min: 0, max: 1023 },
    ph_level: { min: 0, max: 14 },
    water_tank: { min: 0, max: 100 }
  }

  const range = ranges[type]
  if (!range) return { valid: true, message: '' }

  if (!validateNumber(value, range.min, range.max)) {
    return {
      valid: false,
      message: `Value must be between ${range.min} and ${range.max}`
    }
  }

  // Additional warnings
  if (type === 'ph_level') {
    const ph = parseFloat(value)
    if (ph < 4 || ph > 9) {
      return {
        valid: true,
        warning: 'Unusual pH value - check sensor calibration'
      }
    }
  }

  return { valid: true, message: '' }
}

export const validateForm = (data, rules) => {
  const errors = {}

  for (const field in rules) {
    const value = data[field]
    const fieldRules = rules[field]

    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${fieldRules.label || field} is required`
      continue
    }

    if (value && fieldRules.validate) {
      const result = fieldRules.validate(value)
      if (!result.valid) {
        errors[field] = result.message
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
