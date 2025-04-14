// frontend/src/services/auth.js
import { authAPI } from './api';

// Set user in local storage
const setUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userData.token);
};

// Remove user from local storage
const removeUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Get user from local storage
const getUserFromStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Register user
export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    if (response.data.success) {
      setUserData(response.data.user);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    if (response.data.success) {
      setUserData(response.data.user);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

// Logout user
export const logout = () => {
  removeUserData();
  return { success: true, message: 'Logged out successfully' };
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await authAPI.getProfile();
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get user profile' };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getUserFromStorage
};