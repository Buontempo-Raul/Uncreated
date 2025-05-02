// frontend/src/services/auth.js - Fix the auth service
import api from './api';

// Login user
export const login = async (credentials) => {
  try {
    // Make the request to the correct endpoint
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      // Store token and user data
      localStorage.setItem('token', response.data.user.token);
      
      // Store user without token
      const userData = { ...response.data.user };
      delete userData.token;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      return error.response.data;
    }
    return { success: false, message: 'Network error. Please try again later.' };
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.user.token);
      
      // Store user data without token
      const userDataCopy = { ...response.data.user };
      delete userDataCopy.token;
      localStorage.setItem('user', JSON.stringify(userDataCopy));
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.user.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    if (error.response) {
      return error.response.data;
    }
    return { 
      success: false, 
      message: 'Network error. Please try again later.' 
    };
  }
};

// Logout user
export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Remove auth header
  api.defaults.headers.common['Authorization'] = '';
  
  return { success: true, message: 'Logged out successfully' };
};

export default {
  login,
  register,
  logout
};