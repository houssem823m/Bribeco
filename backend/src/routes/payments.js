const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Validation rules
const createPaymentIntentValidation = [
  body('reservationId')
    .notEmpty()
    .withMessage('Reservation ID is required')
    .isMongoId()
    .withMessage('Invalid reservation ID'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
];

const confirmPaymentValidation = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required')
    .trim(),
  body('simulate_success')
    .optional()
    .isBoolean()
    .withMessage('simulate_success must be a boolean'),
];

const webhookValidation = [
  body('type')
    .notEmpty()
    .withMessage('Event type is required')
    .isIn([
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'payment_intent.failed',
      'charge.refunded',
    ])
    .withMessage('Invalid event type'),
  body('data.object')
    .notEmpty()
    .withMessage('Event data object is required'),
];

// Routes
router.post(
  '/create-intent',
  auth,
  authorize('client'),
  createPaymentIntentValidation,
  paymentController.createPaymentIntent
);

router.post(
  '/confirm',
  auth,
  authorize('client'),
  confirmPaymentValidation,
  paymentController.confirmPayment
);

// Webhook route (public, but should be protected with signature verification in production)
router.post('/webhook', webhookValidation, paymentController.handleWebhook);

module.exports = router;

