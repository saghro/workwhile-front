// src/services/authService.js
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    try {
      console.log('🔐 Registering user:', { email: userData.email, role: userData.role });

      const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'candidate'
      };

      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
      const responseData = response.data;

      console.log('✅ Registration successful');

      // Store auth data
      if (responseData.data.token) {
        localStorage.setItem('token', responseData.data.token);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
      }

      return {
        user: responseData.data.user,
        token: responseData.data.token,
        userId: responseData.data.user._id,
        role: responseData.data.user.role
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      console.log('🔐 Logging in user:', { email: credentials.email });

      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const responseData = response.data;

      console.log('✅ Login successful');

      // Store auth data
      if (responseData.data.token) {
        localStorage.setItem('token', responseData.data.token);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
      }

      return {
        user: responseData.data.user,
        token: responseData.data.token,
        userId: responseData.data.user._id,
        role: responseData.data.user.role
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      console.log('🚪 Logging out user');

      // Try to call logout endpoint
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      console.log('✅ Logout successful');
      return true;
    } catch (error) {
      console.error('⚠️ Logout API error (cleaning local data anyway):', error);

      // Clear local storage even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return true;
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    try {
      console.log('👤 Getting current user');

      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      const responseData = response.data;

      console.log('✅ Got current user');

      return {
        user: responseData.data.user,
        userId: responseData.data.user._id,
        role: responseData.data.user.role
      };
    } catch (error) {
      console.error('❌ Get current user error:', error);

      // If unauthorized, clean up local storage
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    try {
      console.log('🔑 Sending forgot password request for:', email);

      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });

      console.log('✅ Forgot password request sent');
      return response.data;
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Reset password
   */
  resetPassword: async (token, password) => {
    try {
      console.log('🔑 Resetting password with token');

      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password
      });

      const responseData = response.data;

      console.log('✅ Password reset successful');

      // Store new auth data
      if (responseData.data.token) {
        localStorage.setItem('token', responseData.data.token);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
      }

      return {
        user: responseData.data.user,
        token: responseData.data.token,
        userId: responseData.data.user._id,
        role: responseData.data.user.role
      };
    } catch (error) {
      console.error('❌ Reset password error:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Get stored token
   */
  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Clear all auth data
   */
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🧹 Auth data cleared');
  }
};

export default authService;