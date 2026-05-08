const axios = require('axios');

// Create axios instance with default configuration
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request:', request.method, request.url);
  console.log('Request Headers:', request.headers);
  return request;
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('Response Error:', error.response?.status, error.config?.url);
    console.error('Error Response Data:', error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosInstance;