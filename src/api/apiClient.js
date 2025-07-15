import axios from 'axios';

// Create an axios instance with common configuration
const apiClient = axios.create({
  baseURL: '/api', // Use relative URL to leverage Vite's proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // You could implement token refresh logic here
      
      // For now, just handle the unauthorized error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // You could dispatch a logout action here
      // store.dispatch(logout());
      
      // Or redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;