// Date, number, and currency formatters

export const formatDate = (dateString, locale = 'en-IN') => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString, locale = 'en-IN') => {
  const date = new Date(dateString)
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (dateString, locale = 'en-IN') => {
  const date = new Date(dateString)
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined) return 'N/A'
  return Number(number).toFixed(decimals)
}

export const formatTemperature = (temp) => {
  if (temp === null || temp === undefined) return 'N/A'
  return `${temp.toFixed(1)}°C`
}

export const formatHumidity = (humidity) => {
  if (humidity === null || humidity === undefined) return 'N/A'
  return `${humidity.toFixed(1)}%`
}

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatVolume = (liters) => {
  if (liters === null || liters === undefined) return 'N/A'
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(2)} KL`
  }
  return `${liters.toFixed(0)} L`
}

export const formatWeight = (grams) => {
  if (grams === null || grams === undefined) return 'N/A'
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`
  }
  return `${grams.toFixed(0)} g`
}

export const formatSensorValue = (type, value) => {
  switch (type) {
    case 'temperature':
      return formatTemperature(value)
    case 'humidity':
      return formatHumidity(value)
    case 'soil_moisture':
      return value !== null && value !== undefined ? `${value.toFixed(0)}` : 'N/A'
    case 'ph_level':
      return value !== null && value !== undefined ? value.toFixed(1) : 'N/A'
    default:
      return formatNumber(value)
  }
}

export const timeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}
