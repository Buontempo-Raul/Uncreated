// backend/routes/auth.js
// First, make sure your routes are correctly defined
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register user
router.post('/register', registerUser);

// Login user 
router.post('/login', loginUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;