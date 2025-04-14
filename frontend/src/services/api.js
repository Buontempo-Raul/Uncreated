// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// User services
export const userAPI = {
  getUserByUsername: (username) => api.get(`/users/${username}`),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUserArtworks: (username) => api.get(`/users/${username}/artworks`),
  addToFavorites: (artworkId) => api.post(`/users/favorites/${artworkId}`),
  removeFromFavorites: (artworkId) => api.delete(`/users/favorites/${artworkId}`),
};

// Artwork services
export const artworkAPI = {
  getArtworks: (params) => api.get('/artworks', { params }),
  getArtworkById: (id) => api.get(`/artworks/${id}`),
  createArtwork: (artworkData) => api.post('/artworks', artworkData),
  updateArtwork: (id, artworkData) => api.put(`/artworks/${id}`, artworkData),
  deleteArtwork: (id) => api.delete(`/artworks/${id}`),
  likeArtwork: (id) => api.post(`/artworks/${id}/like`),
};

// Shop services
export const shopAPI = {
  getFeaturedArtworks: () => api.get('/shop/featured'),
  createOrder: (orderData) => api.post('/shop/orders', orderData),
  getOrderById: (id) => api.get(`/shop/orders/${id}`),
  getMyOrders: () => api.get('/shop/myorders'),
  updateOrderToPaid: (id, paymentResult) => api.put(`/shop/orders/${id}/pay`, paymentResult),
  updateOrderToDelivered: (id) => api.put(`/shop/orders/${id}/deliver`),
};

export default api;