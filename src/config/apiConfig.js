// src/config/apiConfig.js
import axios from 'axios';

// Create an axios instance with common configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Define all API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    SAVED_JOBS: '/users/saved-jobs',
    SAVE_JOB: (jobId) => `/users/save-job/${jobId}`,
    UNSAVE_JOB: (jobId) => `/users/save-job/${jobId}`,
    UPLOAD_AVATAR: '/users/upload-avatar',
    DELETE_ACCOUNT: '/users/profile',
    GET_USERS: '/users',
    GET_USER: (id) => `/users/${id}`,
    UPDATE_USER_STATUS: (id) => `/users/${id}/status`
  },
  JOBS: {
    GET_JOBS: '/jobs',
    GET_JOB: (id) => `/jobs/${id}`,
    CREATE_JOB: '/jobs',
    GET_MY_JOBS: '/jobs/my/jobs',
    UPDATE_JOB: (id) => `/jobs/${id}`,
    DELETE_JOB: (id) => `/jobs/${id}`
  },
  APPLICATIONS: {
    CREATE: '/applications',
    GET_MY_APPLICATIONS: '/applications/my',
    GET_JOB_APPLICATIONS: (jobId) => `/applications/job/${jobId}`,
    UPDATE_STATUS: (id) => `/applications/${id}/status`,
    WITHDRAW: (id) => `/applications/${id}/withdraw`
  },
  COMPANIES: {
    CREATE: '/companies',
    GET_MY_COMPANY: '/companies/my',
    UPDATE_COMPANY: '/companies/my',
    GET_COMPANIES: '/companies',
    GET_COMPANY: (id) => `/companies/${id}`
  }
};

// Add a request interceptor to add auth token to every request
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Log the request for debugging
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => {
      // Log successful responses
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Log error responses
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
);

// Helper function to handle API errors consistently
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data.message || data.error || 'An error occurred',
      errors: data.errors || []
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: 'Network error - please check your connection',
      errors: []
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      errors: []
    };
  }
};

export default apiClient;