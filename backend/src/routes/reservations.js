const express = require('express');
const { body } = require('express-validator');
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { reservations_status_enum } = require('../models/enums');

const router = express.Router();

// Validation rules
const createReservationValidation = [
  body('serviceId')
    .notEmpty()
    .withMessage('Service ID is required')
    .isMongoId()
    .withMessage('Invalid service ID'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 255 })
    .withMessage('Address must be between 5 and 255 characters'),
  body('postal_code')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .isLength({ min: 4, max: 10 })
    .withMessage('Postal code must be between 4 and 10 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('urgent')
    .optional()
    .isBoolean()
    .withMessage('Urgent must be a boolean'),
  body('date_requested')
    .optional()
    .isISO8601()
    .withMessage('Date requested must be a valid date')
    .toDate(),
  body('time_slot')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Time slot must be less than 50 characters'),
];

const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(reservations_status_enum)
    .withMessage(`Status must be one of: ${reservations_status_enum.join(', ')}`),
];

const assignPartnerValidation = [
  body('partnerId')
    .notEmpty()
    .withMessage('Partner ID is required')
    .isMongoId()
    .withMessage('Invalid partner ID'),
];

// Routes
router.post('/', auth, authorize('client'), createReservationValidation, reservationController.createReservation);
router.get('/me', auth, authorize('client'), reservationController.getMyReservations);
router.get('/:id', auth, reservationController.getReservationById);
router.put('/:id/status', auth, updateStatusValidation, reservationController.updateReservationStatus);
router.post('/:id/assign', auth, authorize('admin'), assignPartnerValidation, reservationController.assignPartner);

module.exports = router;

