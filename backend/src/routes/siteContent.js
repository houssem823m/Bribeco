const express = require('express');
const siteContentController = require('../controllers/siteContentController');

const router = express.Router();

// Public route to get site content
router.get('/:page', siteContentController.getSiteContent);

module.exports = router;

