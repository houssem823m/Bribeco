const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

Sentry.init({
  dsn: env.SENTRY_DSN || undefined,
  environment: env.SENTRY_ENVIRONMENT,
  tracesSampleRate: 1.0,
});

if (env.SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
}

const normalizeOrigin = (origin) => (origin ? origin.replace(/\/$/, '') : origin);
const whitelist = new Set(
  [...env.CLIENT_URLS.map(normalizeOrigin), normalizeOrigin(env.SERVER_URL)].filter(Boolean)
);

const allowAllOrigins = env.NODE_ENV !== 'production';

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowAllOrigins) {
      return callback(null, true);
    }
    const normalizedOrigin = normalizeOrigin(origin);
    if (whitelist.has(normalizedOrigin)) {
      return callback(null, true);
    }
    const corsError = new Error('Not allowed by CORS');
    corsError.statusCode = 403;
    return callback(corsError);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(compression());

if (env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Import rate limiters
const { apiLimiter, adminLimiter } = require('./src/middlewares/rateLimiters');

// Apply admin rate limiter to admin routes (more lenient)
app.use('/api/admin', adminLimiter);

// Apply general rate limiter to other API routes
// Note: This will be bypassed for authenticated admin users via skip function
app.use('/api', apiLimiter);

const uploadsDir = path.join(__dirname, 'uploads');
app.use(
  '/uploads',
  (req, res, next) => {
    if (req.path.includes('..')) {
      return res.status(400).json({ success: false, message: 'Invalid file path' });
    }
    return next();
  },
  express.static(uploadsDir, { dotfiles: 'deny', maxAge: '7d' })
);

app.get('/healthz', async (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'ok' : 'down';
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    db: dbState,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/services', require('./src/routes/services'));
app.use('/api/reservations', require('./src/routes/reservations'));
app.use('/api/partner-requests', require('./src/routes/partnerRequests'));
app.use('/api/site-content', require('./src/routes/siteContent'));
app.use('/api/partners', require('./src/routes/partners'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/payments', require('./src/routes/payments'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

if (env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(errorHandler);

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdown('UNCAUGHT_EXCEPTION');
});

module.exports = app;

