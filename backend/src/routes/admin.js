const express = require('express');
const { body } = require('express-validator');
const partnerRequestController = require('../controllers/partnerRequestController');
const adminController = require('../controllers/adminController');
const siteContentController = require('../controllers/siteContentController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const adminLogger = require('../middlewares/adminLogger');

const router = express.Router();

// Validation rules
const createFAQValidation = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Question must be between 5 and 500 characters'),
  body('answer')
    .trim()
    .notEmpty()
    .withMessage('Answer is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Answer must be between 10 and 2000 characters'),
];

const updateFAQValidation = [
  body('question')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Question cannot be empty')
    .isLength({ min: 5, max: 500 })
    .withMessage('Question must be between 5 and 500 characters'),
  body('answer')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Answer cannot be empty')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Answer must be between 10 and 2000 characters'),
];

const createTestimonialValidation = [
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters'),
  body('approved')
    .optional()
    .isBoolean()
    .withMessage('Approved must be a boolean'),
];

const updateTestimonialValidation = [
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters'),
  body('approved')
    .optional()
    .isBoolean()
    .withMessage('Approved must be a boolean'),
];

// Admin routes - all require admin role
// Overview
router.get('/overview', auth, authorize('admin'), adminLogger('GET_OVERVIEW'), adminController.getOverview);
router.get(
  '/reservations',
  auth,
  authorize('admin'),
  adminLogger('GET_SERVICE_REQUESTS'),
  adminController.getAllServiceRequests
);

// Partner Requests (existing)
router.get('/partner-requests', auth, authorize('admin'), adminLogger('GET_PARTNER_REQUESTS'), partnerRequestController.getAllPartnerRequests);
router.put('/partner-requests/:id/accept', auth, authorize('admin'), adminLogger('ACCEPT_PARTNER_REQUEST'), partnerRequestController.acceptPartnerRequest);
router.put('/partner-requests/:id/reject', auth, authorize('admin'), adminLogger('REJECT_PARTNER_REQUEST'), partnerRequestController.rejectPartnerRequest);

// FAQ CRUD
router.get('/faqs', auth, authorize('admin'), adminLogger('GET_FAQS'), adminController.getAllFAQs);
router.post('/faqs', auth, authorize('admin'), adminLogger('CREATE_FAQ'), createFAQValidation, adminController.createFAQ);
router.put('/faqs/:id', auth, authorize('admin'), adminLogger('UPDATE_FAQ'), updateFAQValidation, adminController.updateFAQ);
router.delete('/faqs/:id', auth, authorize('admin'), adminLogger('DELETE_FAQ'), adminController.deleteFAQ);

// Testimonials CRUD
router.get('/testimonials', auth, authorize('admin'), adminLogger('GET_TESTIMONIALS'), adminController.getAllTestimonials);
router.post('/testimonials', auth, authorize('admin'), adminLogger('CREATE_TESTIMONIAL'), createTestimonialValidation, adminController.createTestimonial);
router.put('/testimonials/:id', auth, authorize('admin'), adminLogger('UPDATE_TESTIMONIAL'), updateTestimonialValidation, adminController.updateTestimonial);
router.delete('/testimonials/:id', auth, authorize('admin'), adminLogger('DELETE_TESTIMONIAL'), adminController.deleteTestimonial);

// Payments Management
router.get('/payments', auth, authorize('admin'), adminLogger('GET_PAYMENTS'), adminController.getAllPayments);

// Partners Management (for assignment)
router.get('/partners', auth, authorize('admin'), adminLogger('GET_PARTNERS'), adminController.getAllPartners);
router.get('/partners/:id', auth, authorize('admin'), adminLogger('GET_PARTNER'), adminController.getPartnerById);
router.get('/partners/:id/assignments', auth, authorize('admin'), adminLogger('GET_PARTNER_ASSIGNMENTS'), adminController.getPartnerAssignments);

// Site Content Management
router.get('/site-content/:page', auth, authorize('admin'), adminLogger('GET_SITE_CONTENT'), siteContentController.getSiteContent);
router.put('/site-content/:page', auth, authorize('admin'), adminLogger('UPDATE_SITE_CONTENT'), siteContentController.updateSiteContent);

module.exports = router;

