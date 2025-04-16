// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { 
  getUserByUsername,
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUser,
  deleteUser,
  makeUserArtist,
  getUserArtworks,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/:username', getUserByUsername);
router.get('/:username/artworks', getUserArtworks);

// Protected routes (logged in users)
router.put('/profile', protect, updateUserProfile);
router.get('/favorites', protect, getUserFavorites);
router.post('/favorites/:artworkId', protect, addToFavorites);
router.delete('/favorites/:artworkId', protect, removeFromFavorites);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.get('/id/:userId', protect, admin, getUserById);
router.put('/:userId', protect, admin, updateUser);
router.delete('/:userId', protect, admin, deleteUser);
router.put('/:userId/artist', protect, admin, makeUserArtist);

module.exports = router;