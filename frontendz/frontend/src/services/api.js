import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vouchgrid_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Standardized error interceptor per Section 25
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let message = 'An unexpected error occurred. Please try again.';

    if (status === 400) {
      message = error.response.data?.message || 'Invalid request data.';
    } else if (status === 401) {
      message = 'Your session has expired. Please sign in again.';
      localStorage.removeItem('vouchgrid_token');
      localStorage.removeItem('vouchgrid_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vouchgrid:unauthorized'));
      }
    } else if (status === 403) {
      message = "You don't have permission to perform this action.";
    } else if (status === 404) {
      message = 'The requested resource was not found.';
    } else if (status === 409) {
      message = 'This contribution or claim conflict already exists.';
    } else if (status >= 500) {
      message = 'Server error. Please contact team or try again later.';
    } else if (!error.response) {
      message = 'Network error. Could not connect to the VouchGrid backend API.';
    }

    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

export default api;
