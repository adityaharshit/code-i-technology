import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send session cookies
  timeout: 10000, // 10 second timeout
});

// Log the API URL in development for debugging
// if (import.meta.env.DEV) {
//   console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api (fallback)');
// }

// Request interceptor (no Bearer token, sessions handle auth)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (
        !window.location.pathname.includes('/login') &&
        !error.config?.url?.includes('/auth/me')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
