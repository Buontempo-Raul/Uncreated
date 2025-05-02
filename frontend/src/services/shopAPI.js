// frontend/src/services/shopAPI.js
import api from './api';

// Get featured artworks for shop
export const getFeaturedArtworks = async () => {
  return await api.get('/shop/featured');
};

// Get recent artworks
export const getRecentArtworks = async () => {
  return await api.get('/shop/recent');
};

// Get popular artworks
export const getPopularArtworks = async () => {
  return await api.get('/shop/popular');
};

// Get cart
export const getCart = async () => {
  return await api.get('/shop/cart');
};

// Add to cart
export const addToCart = async (artworkId, quantity = 1) => {
  return await api.post('/shop/cart', { artworkId, quantity });
};

// Create order
export const createOrder = async (orderData) => {
  return await api.post('/shop/orders', orderData);
};

// Get order by ID
export const getOrderById = async (id) => {
  return await api.get(`/shop/orders/${id}`);
};

// Get my orders
export const getMyOrders = async () => {
  return await api.get('/shop/myorders');
};

// Update order to paid
export const updateOrderToPaid = async (id, paymentResult) => {
  return await api.put(`/shop/orders/${id}/pay`, paymentResult);
};

export default {
  getFeaturedArtworks,
  getRecentArtworks,
  getPopularArtworks,
  getCart,
  addToCart,
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid
};