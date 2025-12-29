const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const partnerRequestController = require('../controllers/partnerRequestController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/upload');

const router = express.Router();

// Validation rules
const createPartnerRequestValidation = [
  body('service_type')
    .trim()
    .notEmpty()
    .withMessage('Service type is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Service type must be between 2 and 150 characters'),
  body('experience_years')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience years must be a non-negative integer'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must be less than 1000 characters'),
];

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

// Routes
router.post(
  '/',
  auth,
  authorize('client'),
  upload.single('cv_file'),
  handleMulterError,
  createPartnerRequestValidation,
  partnerRequestController.createPartnerRequest
);

module.exports = router;

