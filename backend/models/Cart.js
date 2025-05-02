// backend/models/Cart.js

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [
    {
      artwork: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artwork'
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;