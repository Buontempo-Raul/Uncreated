// backend/routes/shop.js - Enhanced with new routes

const express = require('express');
const router = express.Router();
const { 
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getFeaturedArtworks,
  getRecentArtworks,
  getPopularArtworks,
  addToCart,
  getCart
} = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
// Get featured artworks for shop
router.get('/featured', getFeaturedArtworks);

// Get recent artworks
router.get('/recent', getRecentArtworks);

// Get popular artworks
router.get('/popular', getPopularArtworks);

// Protected routes
// Cart routes
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);

// Order routes
router.post('/orders', protect, createOrder);
router.get('/orders/:id', protect, getOrderById);
router.get('/myorders', protect, getMyOrders);
router.put('/orders/:id/pay', protect, updateOrderToPaid);
router.put('/orders/:id/deliver', protect, updateOrderToDelivered);

module.exports = router;