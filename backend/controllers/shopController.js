// backend/controllers/shopController.js
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/shop/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    // Update artwork status to sold
    for (const item of orderItems) {
      await Artwork.findByIdAndUpdate(item.artwork, {
        isSold: true,
        forSale: false
      });
    }

    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/shop/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/shop/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/shop/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/shop/orders/:id/deliver
// @access  Private
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured artworks for shop
// @route   GET /api/shop/featured
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

// @desc    Get recent artworks for shop
// @route   GET /api/shop/recent
// @access  Public
const getRecentArtworks = async (req, res) => {
  try {
    const recentArtworks = await Artwork.find({
      forSale: true,
      isSold: false
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('creator', 'username profileImage');

    res.json({
      success: true,
      artworks: recentArtworks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get popular artworks for shop
// @route   GET /api/shop/popular
// @access  Public
const getPopularArtworks = async (req, res) => {
  try {
    const popularArtworks = await Artwork.find({
      forSale: true,
      isSold: false
    })
      .sort({ views: -1 })
      .limit(8)
      .populate('creator', 'username profileImage');

    res.json({
      success: true,
      artworks: popularArtworks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/shop/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { artworkId, quantity = 1 } = req.body;
    
    // Check if artwork exists and is for sale
    const artwork = await Artwork.findOne({ 
      _id: artworkId,
      forSale: true,
      isSold: false
    });
    
    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found or not available for purchase'
      });
    }
    
    // Get user cart (or create if it doesn't exist)
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: []
      });
    }
    
    // Check if item already in cart
    const itemIndex = cart.items.findIndex(item => 
      item.artwork.toString() === artworkId
    );
    
    if (itemIndex > -1) {
      // Update quantity if item exists
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Add new item
      cart.items.push({
        artwork: artworkId,
        quantity,
        price: artwork.price
      });
    }
    
    // Calculate totals
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user cart
// @route   GET /api/shop/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.artwork',
        select: 'title images price category',
        populate: {
          path: 'creator',
          select: 'username profileImage'
        }
      });
    
    if (!cart) {
      return res.json({
        success: true,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      });
    }
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Export all methods
module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getFeaturedArtworks,
  getRecentArtworks,
  getPopularArtworks,
  addToCart,
  getCart
};