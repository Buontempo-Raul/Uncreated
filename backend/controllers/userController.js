// backend/controllers/userController.js
const User = require('../models/User');
const Artwork = require('../models/Artwork');

// @desc    Get user by username
// @route   GET /api/users/:username
// @access  Public
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
        website: user.website,
        isArtist: user.isArtist,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profileImage = req.body.profileImage || user.profileImage;
    user.bio = req.body.bio || user.bio;
    user.website = req.body.website || user.website;
    user.isArtist = req.body.isArtist !== undefined ? req.body.isArtist : user.isArtist;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        website: updatedUser.website,
        isArtist: updatedUser.isArtist
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user artworks
// @route   GET /api/users/:username/artworks
// @access  Public
const getUserArtworks = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const artworks = await Artwork.find({ creator: user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      artworks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add artwork to user favorites
// @route   POST /api/users/favorites/:artworkId
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { artworkId } = req.params;
    
    // Check if artwork exists
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artwork not found' 
      });
    }

    const user = await User.findById(req.user._id);
    
    // Check if already in favorites
    if (user.favorites.includes(artworkId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artwork already in favorites' 
      });
    }
    
    // Add to favorites
    user.favorites.push(artworkId);
    await user.save();
    
    res.json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove artwork from user favorites
// @route   DELETE /api/users/favorites/:artworkId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const { artworkId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    // Check if in favorites
    if (!user.favorites.includes(artworkId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artwork not in favorites' 
      });
    }
    
    // Remove from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== artworkId);
    await user.save();
    
    res.json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getUserByUsername,
  updateUserProfile,
  getUserArtworks,
  addToFavorites,
  removeFromFavorites
};