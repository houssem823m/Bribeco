const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const Service = require('../models/Service');
const Partner = require('../models/Partner');
const PartnerAssignment = require('../models/PartnerAssignment');
const { reservations_status_enum } = require('../models/enums');

// Helper: Check if user is assigned partner (by checking Partner model)
const isAssignedPartner = async (reservation, userId) => {
  try {
    if (!reservation.assigned_partner) return false;
    
    // Handle both ObjectId and populated object
    const partnerId = reservation.assigned_partner._id 
      ? reservation.assigned_partner._id 
      : reservation.assigned_partner;
    
    const partner = await Partner.findById(partnerId);
    if (!partner) return false;
    
    // Handle both ObjectId and populated object for partner.user
    const partnerUserId = partner.user?._id 
      ? partner.user._id.toString() 
      : partner.user?.toString() 
        ? partner.user.toString() 
        : null;
    
    if (!partnerUserId) return false;
    
    return partnerUserId === userId.toString();
  } catch (error) {
    console.error('Error checking assigned partner:', error);
    return false;
  }
};

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Client only
const createReservation = async (req, res) => {
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

    // Only clients can create reservations
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can create reservations',
      });
    }

    const { serviceId, address, postal_code, description, urgent, date_requested, time_slot } = req.body;

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Validate date_requested is not in the past
    if (date_requested) {
      const requestedDate = new Date(date_requested);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (requestedDate < today) {
        return res.status(400).json({
          success: false,
          message: 'Requested date cannot be in the past',
        });
      }
    }

    // Create reservation
    const reservation = await Reservation.create({
      user: req.user._id,
      service: serviceId,
      address,
      postal_code,
      description,
      urgent: urgent || false,
      date_requested: date_requested ? new Date(date_requested) : null,
      time_slot,
      status: 'nouvelle',
    });

    // Populate service and category
    await reservation.populate({
      path: 'service',
      populate: { path: 'category', select: 'name slug' },
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating reservation',
    });
  }
};

// @desc    Get all reservations for current user
// @route   GET /api/reservations/me
// @access  Client only
const getMyReservations = async (req, res) => {
  try {
    // Only clients can view their reservations
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can view their reservations',
      });
    }

    const reservations = await Reservation.find({ user: req.user._id })
      .populate({
        path: 'service',
        populate: { path: 'category', select: 'name slug' },
      })
      .populate('assigned_partner', 'service_type verified')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Reservations retrieved successfully',
      data: reservations,
      count: reservations.length,
    });
  } catch (error) {
    console.error('Get my reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving reservations',
    });
  }
};

// @desc    Get single reservation by ID
// @route   GET /api/reservations/:id
// @access  Owner, assigned partner, or admin
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate({
        path: 'service',
        populate: { path: 'category', select: 'name slug description' },
      })
      .populate({
        path: 'assigned_partner',
        populate: { path: 'user', select: 'first_name last_name email phone' },
      })
      .populate('user', 'first_name last_name email phone');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Check authorization
    // Get user ID from reservation (could be ObjectId or populated object)
    let reservationUserId;
    if (reservation.user && reservation.user._id) {
      // User is populated
      reservationUserId = reservation.user._id;
    } else if (reservation.user) {
      // User is ObjectId
      reservationUserId = reservation.user;
    } else {
      return res.status(500).json({
        success: false,
        message: 'Reservation has no associated user',
      });
    }
    
    // Use mongoose comparison for ObjectId - convert both to strings for comparison
    const reservationUserIdStr = reservationUserId.toString();
    const currentUserIdStr = req.user._id.toString();
    const isOwner = reservationUserIdStr === currentUserIdStr;
    
    const partnerIsAssigned = await isAssignedPartner(reservation, req.user._id);
    const authorized = 
      isOwner ||
      req.user.role === 'admin' ||
      partnerIsAssigned;

    if (!authorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this reservation',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving reservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Admin or assigned partner
const updateReservationStatus = async (req, res) => {
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

    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findById(id).populate('assigned_partner');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Check authorization: admin or assigned partner
    const partnerIsAssigned = await isAssignedPartner(reservation, req.user._id);
    const isAuthorized = req.user.role === 'admin' || partnerIsAssigned;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this reservation',
      });
    }

    // Prevent updates if reservation is cancelled
    if (reservation.status === 'annulée') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a cancelled reservation',
      });
    }

    // Validate status transition
    if (!reservations_status_enum.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    // Update status
    reservation.status = status;
    await reservation.save();

    // Populate before returning
    await reservation.populate({
      path: 'service',
      populate: { path: 'category', select: 'name slug' },
    });

    res.status(200).json({
      success: true,
      message: 'Reservation status updated successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating reservation status',
    });
  }
};

// @desc    Assign partner to reservation
// @route   POST /api/reservations/:id/assign
// @access  Admin only
const assignPartner = async (req, res) => {
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

    // Only admin can assign partners
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can assign partners',
      });
    }

    const { id } = req.params;
    const { partnerId } = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Prevent assigning if reservation is cancelled or completed
    if (reservation.status === 'annulée' || reservation.status === 'terminée') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign partner to a cancelled or completed reservation',
      });
    }

    // Verify partner exists
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    // Create or update PartnerAssignment
    let assignment = await PartnerAssignment.findOne({
      reservation: id,
      partner: partnerId,
    });

    if (assignment) {
      // Update existing assignment
      assignment.status = 'envoyée';
      await assignment.save();
    } else {
      // Create new assignment
      assignment = await PartnerAssignment.create({
        reservation: id,
        partner: partnerId,
        status: 'envoyée',
      });
    }

    // Update reservation
    reservation.assigned_partner = partnerId;
    reservation.partner_status = 'envoyée';
    await reservation.save();

    // Populate before returning
    await reservation.populate({
      path: 'service',
      populate: { path: 'category', select: 'name slug' },
    });
    await reservation.populate({
      path: 'assigned_partner',
      populate: { path: 'user', select: 'first_name last_name email phone' },
    });

    res.status(200).json({
      success: true,
      message: 'Partner assigned successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Assign partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning partner',
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getReservationById,
  updateReservationStatus,
  assignPartner,
};

