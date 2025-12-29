const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Une erreur est survenue';

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'JSON invalide dans la requête';
  }

  if (env.NODE_ENV !== 'production') {
    console.error('API Error:', err);
  }

  const payload = {
    success: false,
    message,
  };

  if (err.errors) {
    payload.errors = err.errors;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;

