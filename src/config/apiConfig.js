// src/config/apiConfig.js
import axios from 'axios';

// Create an axios instance with common configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://318920b85a06.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
    // Ajouter le header pour contourner l'avertissement ngrok
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true // Important pour les cookies si utilisés
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
  },
  // Nouvel endpoint pour tester la connexion
  HEALTH: '/health'
};

// Add a request interceptor to add auth token to every request
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Toujours ajouter le header ngrok pour éviter les avertissements
      config.headers['ngrok-skip-browser-warning'] = 'true';

      // Log the request for debugging
      const baseURL = config.baseURL || '';
      const url = config.url || '';
      const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;

      console.log(`🚀 ${config.method?.toUpperCase()} ${fullURL}`, config.data || '');

      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => {
      // Log successful responses
      const baseURL = response.config.baseURL || '';
      const url = response.config.url || '';
      const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;

      console.log(`✅ ${response.config.method?.toUpperCase()} ${fullURL}`, response.data);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Log error responses avec plus de détails
      if (error.config) {
        const baseURL = error.config.baseURL || '';
        const url = error.config.url || '';
        const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;

        console.error(`❌ ${error.config?.method?.toUpperCase()} ${fullURL}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }

      // Handle network errors (important pour ngrok)
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        console.error('🌐 Network Error - Vérifiez que ngrok fonctionne et que l\'URL est correcte');
        return Promise.reject({
          ...error,
          message: 'Erreur de connexion au serveur. Vérifiez que le backend est accessible.'
        });
      }

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
      message: 'Network error - please check your connection and ensure the backend is running',
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

// Helper function to test API connection
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    console.log('✅ API Connection successful!', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    const errorInfo = handleApiError(error);
    return { success: false, error: errorInfo };
  }
};

// Helper to get current API base URL
export const getApiBaseUrl = () => {
  return apiClient.defaults.baseURL;
};

// Helper to update base URL (utile si l'URL ngrok change)
export const updateApiBaseUrl = (newBaseUrl) => {
  apiClient.defaults.baseURL = newBaseUrl;
  console.log(`🔄 API Base URL updated to: ${newBaseUrl}`);
};

export default apiClient;