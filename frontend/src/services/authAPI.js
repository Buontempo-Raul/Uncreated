import api from './api';

// Login user
export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

// Register user
export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

// Get user profile
export const getProfile = async () => {
  return await api.get('/auth/profile');
};

export default {
  login,
  register,
  getProfile
};