// backend/controllers/userController.js
const userService = require('../services/userService');
const User = require('../models/User');
const Artwork = require('../models/Artwork');

// @desc    Get user by username
// @route   GET /api/users/:username
// @access  Public
const getUserByUsername = async (req, res) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);

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
    res.status(error.message === 'User not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const result = await userService.getAllUsers(query, page, limit);
    
    res.json({
      success: true,
      users: result.users,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalUsers: result.totalUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/users/id/:userId
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(error.message === 'User not found' || error.message === 'Invalid user ID format' ? 404 : 500).json({
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
    const user = await userService.updateUserProfile(req.user._id, req.body);

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        website: user.website,
        isArtist: user.isArtist
      }
    });
  } catch (error) {
    const status = 
      error.message === 'User not found' ? 404 :
      error.message === 'Email already in use' || error.message === 'Username already taken' ? 400 : 500;
    
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user (admin only)
// @route   PUT /api/users/:userId
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.params.userId, req.body);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    const status = 
      error.message === 'User not found' || error.message === 'Invalid user ID format' ? 404 :
      error.message === 'Email already in use' || error.message === 'Username already taken' ? 400 : 500;
    
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.userId);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(error.message === 'User not found' || error.message === 'Invalid user ID format' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Make user an artist
// @route   PUT /api/users/:userId/artist
// @access  Private/Admin
const makeUserArtist = async (req, res) => {
  try {
    const user = await userService.makeUserArtist(req.params.userId);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(error.message === 'User not found' || error.message === 'Invalid user ID format' ? 404 : 500).json({
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
    const user = await userService.getUserByUsername(req.params.username);

    const artworks = await Artwork.find({ creator: user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      artworks
    });
  } catch (error) {
    res.status(error.message === 'User not found' ? 404 : 500).json({
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
    
    const user = await userService.addToFavorites(req.user._id, artworkId);
    
    res.json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    const status = 
      error.message === 'User not found' || error.message === 'Invalid ID format' ? 404 :
      error.message === 'Artwork already in favorites' ? 400 : 500;
    
    res.status(status).json({
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
    
    const user = await userService.removeFromFavorites(req.user._id, artworkId);
    
    res.json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    const status = 
      error.message === 'User not found' || error.message === 'Invalid ID format' ? 404 :
      error.message === 'Artwork not in favorites' ? 400 : 500;
    
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: {
          path: 'creator',
          select: 'username profileImage'
        }
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
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
};