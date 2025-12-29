const { validationResult } = require('express-validator');
const PartnerRequest = require('../models/PartnerRequest');
const Partner = require('../models/Partner');
const User = require('../models/User');

// @desc    Create a partner request
// @route   POST /api/partner-requests
// @access  Client only
const createPartnerRequest = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Only clients can create partner requests
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can create partner requests',
      });
    }

    const { service_type, experience_years, message } = req.body;
    const cv_file = req.file ? req.file.filename : null;

    // Check if user already has a pending request
    const existingRequest = await PartnerRequest.findOne({
      user: req.user._id,
      status: 'en attente',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending partner request',
      });
    }

    // Check if user is already a partner
    const existingPartner = await Partner.findOne({ user: req.user._id });
    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'You are already a partner',
      });
    }

    // Create partner request
    const partnerRequest = await PartnerRequest.create({
      user: req.user._id,
      service_type,
      experience_years,
      cv_file,
      message,
      status: 'en attente',
    });

    // Populate user info
    await partnerRequest.populate('user', 'first_name last_name email phone');

    res.status(201).json({
      success: true,
      message: 'Partner request created successfully',
      data: partnerRequest,
    });
  } catch (error) {
    console.error('Create partner request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating partner request',
    });
  }
};

// @desc    Get all partner requests (admin only)
// @route   GET /api/admin/partner-requests
// @access  Admin only
const getAllPartnerRequests = async (req, res) => {
  try {
    // Only admin can view all requests
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can view all partner requests',
      });
    }

    const { status } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    const requests = await PartnerRequest.find(query)
      .populate('user', 'first_name last_name email phone role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Partner requests retrieved successfully',
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Get partner requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving partner requests',
    });
  }
};

// @desc    Accept a partner request
// @route   PUT /api/admin/partner-requests/:id/accept
// @access  Admin only
const acceptPartnerRequest = async (req, res) => {
  try {
    // Only admin can accept requests
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can accept partner requests',
      });
    }

    const { id } = req.params;

    const partnerRequest = await PartnerRequest.findById(id).populate('user');

    if (!partnerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Partner request not found',
      });
    }

    if (partnerRequest.status !== 'en attente') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a request with status: ${partnerRequest.status}`,
      });
    }

    // Check if user is already a partner
    const existingPartner = await Partner.findOne({ user: partnerRequest.user._id });
    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'User is already a partner',
      });
    }

    // Create Partner record
    const partner = await Partner.create({
      user: partnerRequest.user._id,
      service_type: partnerRequest.service_type,
      verified: true,
    });

    // Update user role to 'partenaire'
    partnerRequest.user.role = 'partenaire';
    await partnerRequest.user.save();

    // Update request status
    partnerRequest.status = 'acceptée';
    await partnerRequest.save();

    // Populate before returning
    await partnerRequest.populate('user', 'first_name last_name email phone role');

    res.status(200).json({
      success: true,
      message: 'Partner request accepted successfully',
      data: {
        partnerRequest,
        partner: {
          _id: partner._id,
          user: partnerRequest.user,
          service_type: partner.service_type,
          verified: partner.verified,
        },
      },
    });
  } catch (error) {
    console.error('Accept partner request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting partner request',
    });
  }
};

// @desc    Reject a partner request
// @route   PUT /api/admin/partner-requests/:id/reject
// @access  Admin only
const rejectPartnerRequest = async (req, res) => {
  try {
    // Only admin can reject requests
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can reject partner requests',
      });
    }

    const { id } = req.params;

    const partnerRequest = await PartnerRequest.findById(id).populate('user');

    if (!partnerRequest) {
      return res.status(404).json({
        success: false,
        message: 'Partner request not found',
      });
    }

    if (partnerRequest.status !== 'en attente') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a request with status: ${partnerRequest.status}`,
      });
    }

    // Update request status
    partnerRequest.status = 'refusée';
    await partnerRequest.save();

    // Populate before returning
    await partnerRequest.populate('user', 'first_name last_name email phone');

    res.status(200).json({
      success: true,
      message: 'Partner request rejected successfully',
      data: partnerRequest,
    });
  } catch (error) {
    console.error('Reject partner request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting partner request',
    });
  }
};

module.exports = {
  createPartnerRequest,
  getAllPartnerRequests,
  acceptPartnerRequest,
  rejectPartnerRequest,
};

