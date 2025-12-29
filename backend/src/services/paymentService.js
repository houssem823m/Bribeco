/**
 * Mock Payment Service (Stripe-like interface)
 * This service simulates Stripe payment operations.
 * To replace with real Stripe:
 * 1. Install: npm install stripe
 * 2. Replace mock functions with Stripe API calls
 * 3. Update environment variables for Stripe keys
 */

// Mock payment intent storage (in production, this would be Stripe's database)
const mockPaymentIntents = new Map();

/**
 * Create a payment intent (mock Stripe)
 * @param {Number} amount - Amount in cents
 * @param {String} currency - Currency code (default: 'eur')
 * @returns {Object} Payment intent object
 */
const createPaymentIntent = async (amount, currency = 'eur') => {
  // Generate mock payment intent ID
  const paymentIntentId = `mock_pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientSecret = `mock_secret_${paymentIntentId}`;

  // Store mock payment intent
  const paymentIntent = {
    id: paymentIntentId,
    client_secret: clientSecret,
    amount: amount,
    currency: currency,
    status: 'requires_payment_method',
    created: Math.floor(Date.now() / 1000),
  };

  mockPaymentIntents.set(paymentIntentId, paymentIntent);

  return {
    id: paymentIntentId,
    client_secret: clientSecret,
    status: paymentIntent.status,
  };
};

/**
 * Confirm a payment intent (mock Stripe)
 * @param {String} paymentIntentId - Payment intent ID
 * @param {Boolean} simulateSuccess - Whether to simulate success or failure
 * @returns {Object} Updated payment intent
 */
const confirmPaymentIntent = async (paymentIntentId, simulateSuccess = true) => {
  const paymentIntent = mockPaymentIntents.get(paymentIntentId);

  if (!paymentIntent) {
    throw new Error('Payment intent not found');
  }

  // Update status based on simulation
  if (simulateSuccess) {
    paymentIntent.status = 'succeeded';
  } else {
    paymentIntent.status = 'payment_failed';
  }

  mockPaymentIntents.set(paymentIntentId, paymentIntent);

  return {
    id: paymentIntent.id,
    status: paymentIntent.status,
    client_secret: paymentIntent.client_secret,
  };
};

/**
 * Get payment intent by ID
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {Object|null} Payment intent or null
 */
const getPaymentIntent = (paymentIntentId) => {
  return mockPaymentIntents.get(paymentIntentId) || null;
};

/**
 * Simulate webhook event
 * Maps Stripe event types to payment status updates
 * @param {String} eventType - Event type (e.g., 'payment_intent.succeeded')
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {String|null} Payment status or null if event not handled
 */
const getPaymentStatusFromWebhook = (eventType, paymentIntentId) => {
  const eventTypeMap = {
    'payment_intent.succeeded': 'payé',
    'payment_intent.payment_failed': 'échoué',
    'payment_intent.failed': 'échoué',
    'charge.refunded': 'remboursé',
  };

  // Verify payment intent exists
  if (!mockPaymentIntents.has(paymentIntentId)) {
    return null;
  }

  const status = eventTypeMap[eventType];
  
  if (status && ['payé', 'échoué', 'remboursé'].includes(status)) {
    // Update mock payment intent status
    const paymentIntent = mockPaymentIntents.get(paymentIntentId);
    if (status === 'payé') {
      paymentIntent.status = 'succeeded';
    } else if (status === 'échoué') {
      paymentIntent.status = 'payment_failed';
    } else if (status === 'remboursé') {
      paymentIntent.status = 'refunded';
    }
    mockPaymentIntents.set(paymentIntentId, paymentIntent);
  }

  return status || null;
};

/**
 * Refund a payment (mock)
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {Object} Refund details
 */
const refundPayment = async (paymentIntentId) => {
  const paymentIntent = mockPaymentIntents.get(paymentIntentId);

  if (!paymentIntent) {
    throw new Error('Payment intent not found');
  }

  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment must be succeeded to refund');
  }

  paymentIntent.status = 'refunded';
  mockPaymentIntents.set(paymentIntentId, paymentIntent);

  return {
    id: `mock_re_${Date.now()}`,
    payment_intent: paymentIntentId,
    status: 'succeeded',
    amount: paymentIntent.amount,
  };
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  getPaymentIntent,
  getPaymentStatusFromWebhook,
  refundPayment,
};

