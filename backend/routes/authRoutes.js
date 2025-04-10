// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

module.exports = router;