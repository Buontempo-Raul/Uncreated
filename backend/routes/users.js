// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { 
  getUserByUsername,
  updateUserProfile,
  getUserArtworks,
  followUser,
  unfollowUser,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { 
  uploadProfileImage, 
  handleUploadError 
} = require('../middleware/uploadMiddleware');

// Public routes
// Get user by username
router.get('/:username', getUserByUsername);

// Get artworks by a specific user
router.get('/:username/artworks', getUserArtworks);

// Protected routes
// Update user profile (with image upload)
router.put(
  '/profile', 
  protect, 
  uploadProfileImage, 
  handleUploadError, 
  updateUserProfile
);

// Follow user routes
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

// Favorites routes
router.get('/favorites', protect, getUserFavorites);
router.post('/favorites/:artworkId', protect, addToFavorites);
router.delete('/favorites/:artworkId', protect, removeFromFavorites);

module.exports = router;