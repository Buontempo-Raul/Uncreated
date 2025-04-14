// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { 
  getUserByUsername,
  updateUserProfile,
  getUserArtworks,
  addToFavorites,
  removeFromFavorites
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Get user by username
router.get('/:username', getUserByUsername);

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Get artworks by a specific user
router.get('/:username/artworks', getUserArtworks);

// Add artwork to favorites
router.post('/favorites/:artworkId', protect, addToFavorites);

// Remove artwork from favorites
router.delete('/favorites/:artworkId', protect, removeFromFavorites);

module.exports = router;