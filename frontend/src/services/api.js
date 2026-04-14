import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  sendOTP: (phone) => api.post('/api/auth/send-otp', { phone }),
  verifyOTP: (phone, otp_code) => api.post('/api/auth/verify-otp', { phone, otp_code }),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/me', data)
}

// Sensor APIs
export const sensorAPI = {
  create: (data) => api.post('/api/sensors', data),
  getLatest: () => api.get('/api/sensors/latest'),
  getHistory: (hours = 24) => api.get('/api/sensors/history', { params: { hours } })
}

// Advice APIs
export const adviceAPI = {
  getAdvice: (question, sensor_data) => api.post('/api/advice', { question, sensor_data }),
  getHistory: (limit = 20) => api.get('/api/advice/history', { params: { limit } })
}

// Weather APIs
export const weatherAPI = {
  getCurrent: () => api.get('/api/weather/current'),
  getForecast: () => api.get('/api/weather/forecast')
}

// Notification APIs
export const notificationAPI = {
  getAlerts: (limit = 50) => api.get('/api/notifications', { params: { limit } }),
  markRead: (alertId) => api.patch(`/api/notifications/${alertId}/read`),
  sendTest: (channel = 'all') => api.post('/api/notifications/test', { channel }),
  sendAlert: (data) => api.post('/api/notifications/send', data)
}

// Resource APIs
export const resourceAPI = {
  logUsage: (data) => api.post('/api/resources/log', data),
  getSummary: (days = 30) => api.get('/api/resources/summary', { params: { days } }),
  getHistory: (days = 30) => api.get('/api/resources/history', { params: { days } }),
  getBudgetStatus: () => api.get('/api/resources/budget-status')
}

// Dashboard APIs
export const dashboardAPI = {
  getMetrics: () => api.get('/api/dashboard/metrics'),
  getTrends: (days = 7) => api.get('/api/dashboard/trends', { params: { days } })
}

export default api
