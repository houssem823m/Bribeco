const express = require('express');
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Validation rules
const createServiceValidation = [
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Service title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Service title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('price_range')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Price range must be less than 50 characters'),
  body('includes')
    .optional()
    .isArray()
    .withMessage('Includes must be an array'),
  body('includes.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each include item must be less than 200 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .trim()
    .isURL()
    .withMessage('Each image must be a valid URL'),
];

const updateServiceValidation = [
  body('categoryId')
    .optional()
    .notEmpty()
    .withMessage('Category ID cannot be empty')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Service title cannot be empty')
    .isLength({ min: 2, max: 200 })
    .withMessage('Service title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('price_range')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Price range must be less than 50 characters'),
  body('includes')
    .optional()
    .isArray()
    .withMessage('Includes must be an array'),
  body('includes.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each include item must be less than 200 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .trim()
    .isURL()
    .withMessage('Each image must be a valid URL'),
];

// Routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', auth, authorize('admin'), createServiceValidation, serviceController.createService);
router.put('/:id', auth, authorize('admin'), updateServiceValidation, serviceController.updateService);
router.delete('/:id', auth, authorize('admin'), serviceController.deleteService);

module.exports = router;

