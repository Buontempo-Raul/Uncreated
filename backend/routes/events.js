// backend/routes/events.js
const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  getUserEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all events
router.get('/', getEvents);

// Get event by ID
router.get('/:id', getEventById);

// Get events by user ID
router.get('/user/:userId', getUserEvents);

// Update event (admin only)
router.put('/:id', protect, admin, updateEvent);

// Delete event (admin only)  
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;