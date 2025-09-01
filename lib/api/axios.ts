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
    // Handle token expiration - redirect to login only if on protected pages
    if (error.response && error.response.status === 401) {
      // Clear tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Only redirect to login if we're on a protected page (not homepage or public pages)
        const currentPath = window.location.pathname;
        const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/forgot-password'];
        const isPublicPage = publicPaths.includes(currentPath) || currentPath.startsWith('/auth/');
        
        if (!isPublicPage && currentPath !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
