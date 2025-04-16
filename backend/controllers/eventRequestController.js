// backend/controllers/eventRequestController.js
const EventRequest = require('../models/EventRequest');

// @desc    Create a new event request
// @route   POST /api/eventRequests
// @access  Private
const createEventRequest = async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;
    
    const eventRequest = new EventRequest({
      title,
      description,
      date,
      location,
      category,
      user: req.user._id,
    });

    const createdEventRequest = await eventRequest.save();
    
    res.status(201).json({
      success: true,
      eventRequest: createdEventRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all event requests
// @route   GET /api/eventRequests
// @access  Private/Admin
const getAllEventRequests = async (req, res) => {
  try {
    const eventRequests = await EventRequest.find({}).populate('user', 'username email');
    
    res.json({
      success: true,
      eventRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user's event requests
// @route   GET /api/eventRequests/my
// @access  Private
const getMyEventRequests = async (req, res) => {
  try {
    const eventRequests = await EventRequest.find({ user: req.user._id });
    
    res.json({
      success: true,
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
// @route   GET /api/eventRequests/:id
// @access  Private
const getEventRequestById = async (req, res) => {
  try {
    const eventRequest = await EventRequest.findById(req.params.id).populate('user', 'username email');
    
    if (!eventRequest) {
      return res.status(404).json({
        success: false,
        message: 'Event request not found'
      });
    }

    // Check if the user is the creator or an admin
    if (eventRequest.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this event request'
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

// @desc    Update event request status
// @route   PUT /api/eventRequests/:id/status
// @access  Private/Admin
const updateEventRequestStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    
    const eventRequest = await EventRequest.findById(req.params.id);
    
    if (!eventRequest) {
      return res.status(404).json({
        success: false,
        message: 'Event request not found'
      });
    }
    
    eventRequest.status = status;
    if (adminComment) {
      eventRequest.adminComment = adminComment;
    }
    
    const updatedEventRequest = await eventRequest.save();
    
    res.json({
      success: true,
      eventRequest: updatedEventRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete event request
// @route   DELETE /api/eventRequests/:id
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
    
    // Check if the user is the creator or an admin
    if (eventRequest.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event request'
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