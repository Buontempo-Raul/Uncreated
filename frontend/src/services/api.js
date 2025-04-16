// src/services/api.js
import axios from 'axios';

// Create an axios instance with default configs
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // IMPORTANT: Don't redirect on 401 errors, just return the error
    // Only redirect for token expiration cases where needed
    if (error.response && error.response.status === 401 && 
        error.response.data && error.response.data.message === 'Token expired') {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // But don't redirect automatically
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;