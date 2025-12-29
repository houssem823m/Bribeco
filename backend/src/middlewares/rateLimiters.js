const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter (for non-admin routes)
// Increased limit significantly to prevent issues during development and admin operations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Significantly increased from 100 to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
  // Skip rate limiting for admin routes (they have their own limiter)
  skip: (req) => {
    return req.path.startsWith('/admin');
  },
});

// Admin rate limiter (more lenient for admin operations)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window (much higher for admin)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
});

module.exports = {
  loginLimiter,
  apiLimiter,
  adminLimiter,
};

