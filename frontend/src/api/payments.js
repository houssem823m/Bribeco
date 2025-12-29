import api from './axios';

/**
 * Create payment intent
 */
export const createPaymentIntent = async (reservationId, amount) => {
  try {
    const response = await api.post('/payments/create-intent', {
      reservationId,
      amount,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create payment intent',
    };
  }
};

/**
 * Confirm payment
 */
export const confirmPayment = async (paymentIntentId, simulateSuccess = true) => {
  try {
    const response = await api.post('/payments/confirm', {
      paymentIntentId,
      simulate_success: simulateSuccess,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Payment confirmation failed',
    };
  }
};

