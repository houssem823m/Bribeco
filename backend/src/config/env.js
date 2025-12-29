const path = require('path');
const dotenvSafe = require('dotenv-safe');

dotenvSafe.config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
  allowEmptyValues: true,
});

const normalizeList = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const PORT = process.env.PORT || 5000;

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  STRIPE_SECRET: process.env.STRIPE_SECRET || 'sk_test_placeholder',
  CLIENT_URLS: normalizeList(process.env.CLIENT_URL || 'http://localhost:5173'),
  SERVER_URL: process.env.SERVER_URL || `http://localhost:${PORT}`,
  SITE_URL: process.env.SITE_URL || 'https://bribeco.com',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
};

module.exports = env;

