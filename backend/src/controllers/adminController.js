const { validationResult } = require('express-validator');
const User = require('../models/User');
const Partner = require('../models/Partner');
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');

// @desc    Get admin overview/dashboard stats
// @route   GET /api/admin/overview
// @access  Admin only
const getOverview = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalPartners = await Partner.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalPayments = await Payment.countDocuments();

    // Get reservations by status
    const reservationsByStatus = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format reservations by status
    const reservationsStatus = {
      nouvelle: 0,
      confirmée: 0,
      'en cours': 0,
      terminée: 0,
      annulée: 0,
    };

    reservationsByStatus.forEach((item) => {
      reservationsStatus[item._id] = item.count;
    });

    // Get pending payments count
    const pendingPayments = await Payment.countDocuments({ status: 'en attente' });

    // Get recent reservations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentReservations = await Reservation.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      message: 'Overview data retrieved successfully',
      data: {
        users: {
          total: totalUsers,
          partners: totalPartners,
        },
        reservations: {
          total: totalReservations,
          byStatus: reservationsStatus,
          recent: recentReservations,
        },
        payments: {
          total: totalPayments,
          pending: pendingPayments,
        },
      },
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving overview',
    });
  }
};

// @desc    Get all service requests (reservations)
// @route   GET /api/admin/reservations
// @access  Admin only
const getAllServiceRequests = async (req, res) => {
  try {
    const { status, urgent, limit } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (urgent === 'true') {
      query.urgent = true;
    } else if (urgent === 'false') {
      query.urgent = false;
    }

    let reservationQuery = Reservation.find(query)
      .populate('user', 'first_name last_name email phone')
      .populate({
        path: 'service',
        select: 'title price_range',
        populate: { path: 'category', select: 'name' },
      })
      .populate({
        path: 'assigned_partner',
        select: 'service_type verified user',
        populate: { path: 'user', select: 'first_name last_name email phone' },
      })
      .sort({ createdAt: -1 });

    if (limit) {
      reservationQuery = reservationQuery.limit(Number(limit));
    }

    const reservations = await reservationQuery;

    res.status(200).json({
      success: true,
      message: 'Service requests retrieved successfully',
      data: reservations,
      count: reservations.length,
    });
  } catch (error) {
    console.error('Get service requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving service requests',
    });
  }
};

// ==================== FAQ CRUD ====================

// @desc    Get all FAQs
// @route   GET /api/admin/faqs
// @access  Admin only
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'FAQs retrieved successfully',
      data: faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving FAQs',
    });
  }
};

// @desc    Create FAQ
// @route   POST /api/admin/faqs
// @access  Admin only
const createFAQ = async (req, res) => {
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

    const { question, answer } = req.body;

    const faq = await FAQ.create({
      question,
      answer,
    });

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating FAQ',
    });
  }
};

// @desc    Update FAQ
// @route   PUT /api/admin/faqs/:id
// @access  Admin only
const updateFAQ = async (req, res) => {
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
    const { question, answer } = req.body;

    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    await faq.save();

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating FAQ',
    });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/admin/faqs/:id
// @access  Admin only
const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting FAQ',
    });
  }
};

// ==================== Testimonials CRUD ====================

// @desc    Get all testimonials
// @route   GET /api/admin/testimonials
// @access  Admin only
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('user', 'first_name last_name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving testimonials',
    });
  }
};

// @desc    Create testimonial
// @route   POST /api/admin/testimonials
// @access  Admin only
const createTestimonial = async (req, res) => {
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

    const { userId, name, rating, comment, approved } = req.body;

    // Verify user exists if userId provided
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    const testimonial = await Testimonial.create({
      user: userId || null,
      name,
      rating,
      comment,
      approved: approved !== undefined ? approved : false,
    });

    await testimonial.populate('user', 'first_name last_name email');

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating testimonial',
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/admin/testimonials/:id
// @access  Admin only
const updateTestimonial = async (req, res) => {
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
    const { userId, name, rating, comment, approved } = req.body;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    // Verify user exists if userId is being updated
    if (userId && userId !== testimonial.user?.toString()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      testimonial.user = userId;
    }

    testimonial.name = name !== undefined ? name : testimonial.name;
    testimonial.rating = rating !== undefined ? rating : testimonial.rating;
    testimonial.comment = comment !== undefined ? comment : testimonial.comment;
    testimonial.approved = approved !== undefined ? approved : testimonial.approved;

    await testimonial.save();

    await testimonial.populate('user', 'first_name last_name email');

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating testimonial',
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/admin/testimonials/:id
// @access  Admin only
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting testimonial',
    });
  }
};

// ==================== Payments Management ====================

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Admin only
const getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate({
        path: 'reservation',
        populate: [
          {
            path: 'user',
            select: 'first_name last_name email phone',
          },
          {
            path: 'service',
            select: 'title',
            populate: { path: 'category', select: 'name' },
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving payments',
    });
  }
};

// @desc    Get all partners (for assignment and management)
// @route   GET /api/admin/partners
// @access  Admin only
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find()
      .populate('user', 'first_name last_name email phone')
      .select('service_type verified user createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Partners retrieved successfully',
      data: partners,
      count: partners.length,
    });
  } catch (error) {
    console.error('Get all partners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving partners',
    });
  }
};

// @desc    Get partner by ID (admin)
// @route   GET /api/admin/partners/:id
// @access  Admin only
const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id)
      .populate('user', 'first_name last_name email phone');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Partner retrieved successfully',
      data: partner,
    });
  } catch (error) {
    console.error('Get partner by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving partner',
    });
  }
};

// @desc    Get partner assignments (admin)
// @route   GET /api/admin/partners/:id/assignments
// @access  Admin only
const getPartnerAssignments = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    const PartnerAssignment = require('../models/PartnerAssignment');
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
      message: 'Partner assignments retrieved successfully',
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    console.error('Get partner assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving partner assignments',
    });
  }
};

module.exports = {
  getOverview,
  getAllServiceRequests,
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllPayments,
  getAllPartners,
  getPartnerById,
  getPartnerAssignments,
};

