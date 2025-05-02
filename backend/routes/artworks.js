// backend/routes/artworks.js - Enhanced with new routes

const express = require('express');
const router = express.Router();
const { 
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  likeArtwork,
  getFeaturedArtworks,
  getCategories
} = require('../controllers/artworkController');
const { protect, isArtist } = require('../middleware/authMiddleware');

// Public routes
// Get all artworks
router.get('/', getArtworks);

// Get categories
router.get('/categories', getCategories);

// Get featured artworks
router.get('/featured', getFeaturedArtworks);

// Get single artwork
router.get('/:id', getArtworkById);

// Protected routes
// Create new artwork
router.post('/', protect, isArtist, createArtwork);

// Update artwork
router.put('/:id', protect, updateArtwork);

// Delete artwork
router.delete('/:id', protect, deleteArtwork);

// Like artwork
router.post('/:id/like', protect, likeArtwork);

module.exports = router;