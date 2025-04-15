// backend/controllers/eventRequestController.js
const EventRequest = require('../models/EventRequest');
const Event = require('../models/Event'); // You'll need to create this model

// @desc    Create a new event request
// @route   POST /api/events/requests
// @access  Private
const createEventRequest = async (req, res) => {
  try {
    const eventRequest = new EventRequest({
      ...req.body,
      user: req.user._id
    });

    const createdRequest = await eventRequest.save();

    res.status(201).json({
      success: true,
      eventRequest: createdRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all event requests
// @route   GET /api/events/requests
// @access  Private/Admin
const getAllEventRequests = async (req, res) => {
  try {
    const eventRequests = await EventRequest.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: eventRequests.length,
      eventRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get event requests by user
// @route   GET /api/events/requests/my
// @access  Private
const getMyEventRequests = async (req, res) => {
  try {
    const eventRequests = await EventRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: eventRequests.length,
      eventRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get event request by ID
// @route   GET /api/events/requests/:id
// @access  Private
const getEventRequestById = async (req, res) => {
  try {
    const eventRequest = await EventRequest.findById(req.params.id)
      .populate('user', 'username email');

    if (!eventRequest) {
      return res.status(404).json({
        success: false,
        message: 'Event request not found'
      });
    }

    // Check if the request belongs to the user or if the user is an admin
    if (eventRequest.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
      });
    }

    res.json({
      success: true,
      eventRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update event request status (approve/reject)
// @route   PUT /api/events/requests/:id/status
// @access  Private/Admin
const updateEventRequestStatus = async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const eventRequest = await EventRequest.findById(req.params.id);

    if (!eventRequest) {
      return res.status(404).json({
        success: false,
        message: 'Event request not found'
      });
    }

    eventRequest.status = status;
    eventRequest.adminFeedback = adminFeedback || '';
    eventRequest.reviewedAt = Date.now();
    eventRequest.reviewedBy = req.user._id;

    const updatedRequest = await eventRequest.save();

    // If approved, create an actual event
    if (status === 'approved') {
      const {
        title,
        description,
        date,
        time,
        location,
        organizer,
        category,
        price,
        isFree,
        image,
        user
      } = eventRequest;

      const event = new Event({
        title,
        description,
        date,
        time,
        location,
        organizer,
        category,
        price,
        isFree,
        image,
        createdBy: user
      });

      await event.save();
    }

    res.json({
      success: true,
      eventRequest: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete event request
// @route   DELETE /api/events/requests/:id
// @access  Private
const deleteEventRequest = async (req, res) => {
  try {
    const eventRequest = await EventRequest.findById(req.params.id);

    if (!eventRequest) {
      return res.status(404).json({
        success: false,
        message: 'Event request not found'
      });
    }

    // Only allow the user who created the request or admin to delete it
    if (eventRequest.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    await eventRequest.deleteOne();

    res.json({
      success: true,
      message: 'Event request removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createEventRequest,
  getAllEventRequests,
  getMyEventRequests,
  getEventRequestById,
  updateEventRequestStatus,
  deleteEventRequest
};