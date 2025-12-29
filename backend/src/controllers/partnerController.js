const { validationResult } = require('express-validator');
const Partner = require('../models/Partner');
const PartnerAssignment = require('../models/PartnerAssignment');
const Reservation = require('../models/Reservation');
const { partner_assignment_status } = require('../models/enums');

// Helper: Check if user is a partner and get partner ID
const getPartnerByUserId = async (userId) => {
  const partner = await Partner.findOne({ user: userId });
  return partner;
};

// @desc    Get current partner info
// @route   GET /api/partners/me
// @access  Partner only
const getCurrentPartner = async (req, res) => {
  try {
    // Only partners can view their own info
    if (req.user.role !== 'partenaire') {
      return res.status(403).json({
        success: false,
        message: 'Only partners can view their info',
      });
    }

    // Find partner by user ID
    const partner = await Partner.findOne({ user: req.user._id })
      .populate('user', 'first_name last_name email phone');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner profile not found. Please contact an administrator.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Partner retrieved successfully',
      data: partner,
    });
  } catch (error) {
    console.error('Get current partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving partner info',
    });
  }
};

// @desc    Get all assignments for a partner
// @route   GET /api/partners/:id/assignments
// @access  Partner only
const getPartnerAssignments = async (req, res) => {
  try {
    // Only partners can view their assignments
    if (req.user.role !== 'partenaire') {
      return res.status(403).json({
        success: false,
        message: 'Only partners can view their assignments',
      });
    }

    const { id } = req.params;

    // Verify the partner ID belongs to the current user
    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    if (partner.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this partner\'s assignments',
      });
    }

    // Get all assignments for this partner
    const assignments = await PartnerAssignment.find({ partner: id })
      .populate({
        path: 'reservation',
        populate: [
          {
            path: 'service',
            populate: { path: 'category', select: 'name slug' },
          },
          {
            path: 'user',
            select: 'first_name last_name email phone',
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Assignments retrieved successfully',
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    console.error('Get partner assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving assignments',
    });
  }
};

// @desc    Partner respond to assignment (accept/reject)
// @route   POST /api/partners/assignments/:assignmentId/respond
// @access  Partner only
const respondToAssignment = async (req, res) => {
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

    // Only partners can respond to assignments
    if (req.user.role !== 'partenaire') {
      return res.status(403).json({
        success: false,
        message: 'Only partners can respond to assignments',
      });
    }

    const { assignmentId } = req.params;
    const { action } = req.body;

    // Find assignment
    const assignment = await PartnerAssignment.findById(assignmentId).populate('partner');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Verify the assignment belongs to the current user
    if (assignment.partner.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to respond to this assignment',
      });
    }

    // Validate action
    if (action !== 'accept' && action !== 'reject') {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "accept" or "reject"',
      });
    }

    // Update assignment status
    if (action === 'accept') {
      assignment.status = 'acceptée';
    } else {
      assignment.status = 'refusée';
    }

    await assignment.save();

    // Update reservation status and partner_status
    const reservation = await Reservation.findById(assignment.reservation);
    if (reservation) {
      if (action === 'accept') {
        reservation.status = 'confirmée';
        reservation.partner_status = 'acceptée';
      } else {
        reservation.partner_status = 'refusée';
        // If rejected, admin might need to assign another partner
      }
      await reservation.save();

      // Populate reservation before returning
      await reservation.populate({
        path: 'service',
        populate: { path: 'category', select: 'name slug' },
      });
    }

    // Populate assignment before returning
    await assignment.populate({
      path: 'reservation',
      populate: [
        {
          path: 'service',
          populate: { path: 'category', select: 'name slug' },
        },
        {
          path: 'user',
          select: 'first_name last_name email phone',
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Assignment ${action === 'accept' ? 'accepted' : 'rejected'} successfully`,
      data: {
        assignment,
        reservation,
      },
    });
  } catch (error) {
    console.error('Respond to assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to assignment',
    });
  }
};

module.exports = {
  getCurrentPartner,
  getPartnerAssignments,
  respondToAssignment,
};

