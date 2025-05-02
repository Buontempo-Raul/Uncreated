// backend/controllers/userController.js
const User = require('../models/User');
const Artwork = require('../models/Artwork');
const fs = require('fs');
const path = require('path');

// @desc    Get user by username
// @route   GET /api/users/:username
// @access  Public
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -__v')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get count of user's artworks
    const artworksCount = await Artwork.countDocuments({ creator: user._id });

    // Format user data for response
    const userData = {
      ...user.toObject(),
      artworksCount,
      followersCount: user.followers ? user.followers.length : 0,
      followingCount: user.following ? user.following.length : 0
    };

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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

    // Fields that can be updated
    const {
      username,
      email,
      bio,
      website,
      isArtist,
      socialLinks
    } = req.body;

    // Check if username is already taken (if changing username)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
      user.username = username;
    }

    // Check if email is already taken (if changing email)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
      user.email = email;
    }

    // Update other fields if provided
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (isArtist !== undefined) user.isArtist = isArtist;
    
    // Update social links if provided
    if (socialLinks) {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinks
      };
    }

    // Handle profile image upload
    if (req.file) {
      // Delete old profile image (except default)
      if (user.profileImage && !user.profileImage.includes('default-profile.jpg')) {
        const oldImagePath = path.join(__dirname, '..', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Set new profile image path
      user.profileImage = req.file.path.replace(/\\/g, '/').replace('backend/', '');
    }

    // Handle password update if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update last active timestamp
    user.lastActive = new Date();

    const updatedUser = await user.save();

    // Send response with user data
    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        website: updatedUser.website,
        isArtist: updatedUser.isArtist,
        socialLinks: updatedUser.socialLinks,
        lastActive: updatedUser.lastActive,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user artworks
// @route   GET /api/users/:username/artworks
// @access  Public
const getUserArtworks = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Count total artworks by this user
    const total = await Artwork.countDocuments({ creator: user._id });

    // Get artworks with pagination
    const artworks = await Artwork.find({ creator: user._id })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creator', 'username profileImage');

    res.json({
      success: true,
      artworks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalArtworks: total
    });
  } catch (error) {
    console.error('Error in getUserArtworks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Can't follow yourself
    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }
    
    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }
    
    // Add to following list
    currentUser.following.push(userToFollow._id);
    await currentUser.save();
    
    // Add to followers list
    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();
    
    res.json({
      success: true,
      message: `You are now following ${userToFollow.username}`,
      followedUser: {
        _id: userToFollow._id,
        username: userToFollow.username,
        profileImage: userToFollow.profileImage
      }
    });
  } catch (error) {
    console.error('Error in followUser:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if actually following
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      });
    }
    
    // Remove from following list
    currentUser.following = currentUser.following.filter(id => 
      id.toString() !== userToUnfollow._id.toString()
    );
    await currentUser.save();
    
    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(id => 
      id.toString() !== currentUser._id.toString()
    );
    await userToUnfollow.save();
    
    res.json({
      success: true,
      message: `You have unfollowed ${userToUnfollow.username}`
    });
  } catch (error) {
    console.error('Error in unfollowUser:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
    console.error('Error in addToFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
    console.error('Error in removeFromFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getUserFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      options: {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { createdAt: -1 }
      },
      populate: {
        path: 'creator',
        select: 'username profileImage'
      }
    });
    
    const total = user.favorites.length;
    
    res.json({
      success: true,
      favorites: user.favorites,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalFavorites: total
    });
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getUserByUsername,
  updateUserProfile,
  getUserArtworks,
  followUser,
  unfollowUser,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
};