const express = require('express');
const { body } = require('express-validator');
const partnerController = require('../controllers/partnerController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Validation rules
const respondToAssignmentValidation = [
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['accept', 'reject'])
    .withMessage('Action must be either "accept" or "reject"'),
];

// Routes
// IMPORTANT: /me must be before /:id to avoid route conflicts
router.get('/me', auth, authorize('partenaire'), partnerController.getCurrentPartner);
router.get('/:id/assignments', auth, authorize('partenaire'), partnerController.getPartnerAssignments);
router.post(
  '/assignments/:assignmentId/respond',
  auth,
  authorize('partenaire'),
  respondToAssignmentValidation,
  partnerController.respondToAssignment
);

module.exports = router;

