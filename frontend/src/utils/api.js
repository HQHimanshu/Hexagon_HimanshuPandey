import axios from 'axios';

const api = axios.create({
  // Point to the backend FastAPI port (8000)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Auth token attached to request:', config.url, '| Token length:', token.length);
  } else {
    console.log('⚠️ NO auth token for request:', config.url);
  }
  return config;
});

// Optionally add a response interceptor to handle 401s centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
