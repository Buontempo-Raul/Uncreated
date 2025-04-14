// backend/routes/artworks.js
const express = require('express');
const router = express.Router();
const { 
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  likeArtwork
} = require('../controllers/artworkController');
const { protect, isArtist } = require('../middleware/authMiddleware');

// Get all artworks
router.get('/', getArtworks);

// Get single artwork
router.get('/:id', getArtworkById);

// Create new artwork
router.post('/', protect, isArtist, createArtwork);

// Update artwork
router.put('/:id', protect, updateArtwork);

// Delete artwork
router.delete('/:id', protect, deleteArtwork);

// Like artwork
router.post('/:id/like', protect, likeArtwork);

module.exports = router;