import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1', // Use the Next.js rewrite rule instead of direct backend URL
  withCredentials: false,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expiration - redirect to login
    if (error.response && error.response.status === 401) {
      // Clear tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
