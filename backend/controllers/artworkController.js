// backend/controllers/artworkController.js
const Artwork = require('../models/Artwork');
const User = require('../models/User');

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
const getArtworks = async (req, res) => {
  try {
    const { 
      category, 
      priceRange, 
      sortBy, 
      limit = 10, 
      page = 1,
      search 
    } = req.query;
    
    const query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      query.price = { $gte: parseFloat(min) || 0 };
      if (max) {
        query.price.$lte = parseFloat(max);
      }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Only show artworks for sale
    query.forSale = true;
    query.isSold = false;

    // Count documents
    const count = await Artwork.countDocuments(query);

    // Sorting
    let sort = {};
    if (sortBy === 'price-asc') {
      sort = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sort = { price: -1 };
    } else if (sortBy === 'latest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'popular') {
      sort = { views: -1 };
    } else {
      // Default sorting by latest
      sort = { createdAt: -1 };
    }

    // Pagination
    const pageSize = parseInt(limit);
    const pageNumber = parseInt(page);
    const skip = (pageNumber - 1) * pageSize;

    const artworks = await Artwork.find(query)
      .sort(sort)
      .limit(pageSize)
      .skip(skip)
      .populate('creator', 'username profileImage');

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / pageSize),
      currentPage: pageNumber,
      artworks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get artwork by ID
// @route   GET /api/artworks/:id
// @access  Public
const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('creator', 'username profileImage bio isArtist');

    if (!artwork) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artwork not found' 
      });
    }

    // Increment view count
    artwork.views += 1;
    await artwork.save();

    res.json({
      success: true,
      artwork
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a new artwork
// @route   POST /api/artworks
// @access  Private (Artists only)
const createArtwork = async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      price,
      category,
      medium,
      dimensions,
      forSale,
      tags
    } = req.body;

    const artwork = new Artwork({
      title,
      description,
      images,
      price,
      category,
      medium,
      dimensions,
      creator: req.user._id,
      forSale,
      tags: tags && tags.length > 0 ? tags : []
    });

    const createdArtwork = await artwork.save();

    res.status(201).json({
      success: true,
      artwork: createdArtwork
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Private (Artwork creator only)
const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artwork not found' 
      });
    }

    // Check if user is artwork creator
    if (artwork.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this artwork' 
      });
    }

    // Update fields
    const {
      title,
      description,
      images,
      price,
      category,
      medium,
      dimensions,
      forSale,
      tags
    } = req.body;

    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.images = images || artwork.images;
    artwork.price = price !== undefined ? price : artwork.price;
    artwork.category = category || artwork.category;
    artwork.medium = medium || artwork.medium;
    artwork.dimensions = dimensions || artwork.dimensions;
    artwork.forSale = forSale !== undefined ? forSale : artwork.forSale;
    artwork.tags = tags || artwork.tags;

    const updatedArtwork = await artwork.save();

    res.json({
      success: true,
      artwork: updatedArtwork
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private (Artwork creator only)
const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artwork not found' 
      });
    }

    // Check if user is artwork creator
    if (artwork.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this artwork' 
      });
    }

    await artwork.deleteOne();

    res.json({
      success: true,
      message: 'Artwork removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like an artwork
// @route   POST /api/artworks/:id/like
// @access  Private
const likeArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artwork not found' 
      });
    }

    // Increment likes
    artwork.likes += 1;
    await artwork.save();

    res.json({
      success: true,
      message: 'Artwork liked',
      likes: artwork.likes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Artwork.aggregate([
      { $match: { forSale: true, isSold: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured artworks
// @route   GET /api/artworks/featured
// @access  Public
const getFeaturedArtworks = async (req, res) => {
  try {
    const featuredArtworks = await Artwork.find({
      forSale: true,
      isSold: false
    })
      .sort({ views: -1, likes: -1 })
      .limit(6)
      .populate('creator', 'username profileImage');

    res.json({
      success: true,
      artworks: featuredArtworks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  likeArtwork,
  getFeaturedArtworks,
  getCategories
};