// Enhanced Application Service with Comprehensive Error Handling and Debugging
// src/services/applicationService.js

import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const applicationService = {
  /**
   * Create a new job application with enhanced error handling and debugging
   */
  createApplication: async (applicationData) => {
    try {
      console.log('🚀 Starting application submission...');
      console.log('Application data type:', applicationData.constructor.name);

      // Enhanced FormData validation and debugging
      const isFormData = applicationData instanceof FormData;
      console.log('Is FormData:', isFormData);

      if (isFormData) {
        console.log('📋 FormData contents:');
        for (let [key, value] of applicationData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}:`, typeof value === 'string' && value.length > 100
                ? value.substring(0, 100) + '...'
                : value);
          }
        }
      }

      // Validate required fields before sending
      const validation = applicationService.validateApplicationData(applicationData);
      if (!validation.isValid) {
        const errorMessage = `Validation failed: ${validation.errors.join(', ')}`;
        console.error('❌ Client-side validation failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Client-side validation passed');

      // Prepare request configuration
      const config = {
        headers: {
          // Don't set Content-Type for FormData - let browser set it with boundary
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        timeout: 30000, // 30 second timeout
        maxContentLength: 10 * 1024 * 1024, // 10MB max
        maxBodyLength: 10 * 1024 * 1024
      };

      console.log('📡 Sending request to:', API_ENDPOINTS.APPLICATIONS.CREATE);
      console.log('Request config:', config);

      // Make the API call
      const response = await apiClient.post(
          API_ENDPOINTS.APPLICATIONS.CREATE,
          applicationData,
          config
      );

      console.log('✅ Application submitted successfully!');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      const { data } = response.data;
      return data.application;

    } catch (error) {
      console.error('❌ Application submission failed!');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);

      // Enhanced error debugging
      if (error.response) {
        console.error('📡 Server Response Error:');
        console.error('  Status:', error.response.status);
        console.error('  Status Text:', error.response.statusText);
        console.error('  Headers:', error.response.headers);
        console.error('  Data:', error.response.data);

        // Log specific backend error details
        if (error.response.data) {
          const { message, error: serverError, stack, details } = error.response.data;
          console.error('🔍 Backend Error Details:');
          if (message) console.error('  Message:', message);
          if (serverError) console.error('  Server Error:', serverError);
          if (stack) console.error('  Stack Trace:', stack);
          if (details) console.error('  Details:', details);
        }

        // Handle specific HTTP status codes
        switch (error.response.status) {
          case 400:
            throw new Error(`Validation Error: ${error.response.data?.message || 'Invalid request data'}`);
          case 401:
            throw new Error('Authentication required. Please log in again.');
          case 403:
            throw new Error('Access denied. You may not have permission to submit applications.');
          case 404:
            throw new Error('Job not found or application endpoint unavailable.');
          case 413:
            throw new Error('File too large. Please ensure your files are under 5MB.');
          case 429:
            throw new Error('Too many requests. Please wait before submitting again.');
          case 500:
            throw new Error(`Server Error: ${error.response.data?.message || 'Internal server error occurred'}`);
          default:
            throw new Error(`Request failed with status ${error.response.status}: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        console.error('📡 Network Error:');
        console.error('  Request was made but no response received');
        console.error('  Request:', error.request);
        throw new Error('Network error: Unable to reach the server. Please check your internet connection.');
      } else {
        console.error('⚙️ Request Setup Error:');
        console.error('  Error setting up request:', error.message);
        throw new Error(`Request setup failed: ${error.message}`);
      }
    }
  },

  /**
   * Enhanced validation with detailed error messages
   */
  validateApplicationData: (applicationData) => {
    const errors = [];

    console.log('🔍 Validating application data...');

    if (!(applicationData instanceof FormData)) {
      errors.push('Application data must be FormData for file uploads');
      return { isValid: false, errors };
    }

    // Required fields validation
    const jobId = applicationData.get('jobId');
    if (!jobId) {
      errors.push('Job ID is required');
    } else {
      console.log('✓ Job ID present:', jobId);
    }

    const personalInfoStr = applicationData.get('personalInfo');
    if (!personalInfoStr) {
      errors.push('Personal information is required');
    } else {
      try {
        const personalInfo = JSON.parse(personalInfoStr);
        console.log('✓ Personal info parsed successfully');

        // Validate personal info fields
        if (!personalInfo.firstName?.trim()) {
          errors.push('First name is required');
        }
        if (!personalInfo.lastName?.trim()) {
          errors.push('Last name is required');
        }
        if (!personalInfo.email?.trim()) {
          errors.push('Email is required');
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(personalInfo.email)) {
            errors.push('Please provide a valid email address');
          }
        }
        if (!personalInfo.phone?.trim()) {
          errors.push('Phone number is required');
        }

        console.log('✓ Personal info validation completed');
      } catch (e) {
        console.error('❌ Failed to parse personal info:', e);
        errors.push('Invalid personal information format');
      }
    }

    // File validation
    const resume = applicationData.get('resume');
    if (!resume || !(resume instanceof File)) {
      errors.push('Resume file is required');
    } else {
      console.log('✓ Resume file present:', resume.name, resume.size, 'bytes');

      // Check file size (5MB limit)
      if (resume.size > 5 * 1024 * 1024) {
        errors.push('Resume file size must be less than 5MB');
      }

      // Check file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + resume.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        errors.push(`Resume must be one of: ${allowedTypes.join(', ')}`);
      }
    }

    // Optional portfolio validation
    const portfolio = applicationData.get('portfolio');
    if (portfolio && portfolio instanceof File) {
      console.log('✓ Portfolio file present:', portfolio.name);

      if (portfolio.size > 5 * 1024 * 1024) {
        errors.push('Portfolio file size must be less than 5MB');
      }

      const allowedPortfolioTypes = ['.pdf', '.doc', '.docx', '.zip', '.rar'];
      const portfolioExtension = '.' + portfolio.name.split('.').pop().toLowerCase();
      if (!allowedPortfolioTypes.includes(portfolioExtension)) {
        errors.push(`Portfolio must be one of: ${allowedPortfolioTypes.join(', ')}`);
      }
    }

    // Cover letter validation
    const coverLetter = applicationData.get('coverLetter');
    if (coverLetter && coverLetter.length < 50) {
      errors.push('Cover letter should be at least 50 characters long');
    }

    console.log(`🔍 Validation completed. ${errors.length} errors found.`);
    if (errors.length > 0) {
      console.error('❌ Validation errors:', errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Test connection to application endpoint
   */
  testApplicationEndpoint: async () => {
    try {
      console.log('🧪 Testing application endpoint...');

      // Try a simple GET request to see if the endpoint is accessible
      const response = await apiClient.get('/applications/test');
      console.log('✅ Application endpoint test successful:', response.status);
      return true;
    } catch (error) {
      console.error('❌ Application endpoint test failed:', error.response?.status || error.message);
      return false;
    }
  },

  /**
   * Get my applications with enhanced error handling
   */
  getMyApplications: async (page = 1, limit = 10, status = null) => {
    try {
      console.log(`📋 Fetching my applications (page: ${page}, limit: ${limit}, status: ${status})`);

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await apiClient.get(`${API_ENDPOINTS.APPLICATIONS.GET_MY_APPLICATIONS}?${params.toString()}`);
      const { data } = response.data;

      console.log(`✅ Fetched ${data.applications?.length || 0} applications`);
      return data.applications || [];
    } catch (error) {
      console.error('❌ Error fetching my applications:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Check if user has applied to a specific job with enhanced caching
   */
  hasAppliedToJob: async (jobId) => {
    try {
      console.log(`🔍 Checking if applied to job: ${jobId}`);

      // Use a more targeted approach to check application status
      const applications = await applicationService.getMyApplications(1, 1000);
      const hasApplied = applications.some(app =>
          app.job?._id === jobId || app.jobId === jobId
      );

      console.log(`✅ Has applied to job ${jobId}: ${hasApplied}`);
      return hasApplied;
    } catch (error) {
      console.error('❌ Error checking job application:', error);
      // Return false on error to allow application attempt
      return false;
    }
  },

  /**
   * Debug FormData helper
   */
  debugFormData: (formData) => {
    console.log('🔍 FormData Debug:');
    console.log('Type:', formData.constructor.name);
    console.log('Contents:');

    if (formData instanceof FormData) {
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }
    } else {
      console.log('Not a FormData object:', formData);
    }
  }
};

export default applicationService;