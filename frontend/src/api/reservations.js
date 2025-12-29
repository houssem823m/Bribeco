import api from './axios';

/**
 * Create a new reservation
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservations', reservationData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create reservation',
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Get current user's reservations
 */
export const getMyReservations = async () => {
  try {
    const response = await api.get('/reservations/me');
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch reservations',
    };
  }
};

/**
 * Get reservation by ID
 */
export const getReservationById = async (id) => {
  try {
    const response = await api.get(`/reservations/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch reservation',
    };
  }
};

/**
 * Update reservation status (admin or assigned partner)
 */
export const updateReservationStatus = async (id, status) => {
  try {
    const response = await api.put(`/reservations/${id}/status`, { status });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update reservation status',
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Assign partner to reservation (admin only)
 */
export const assignPartnerToReservation = async (reservationId, partnerId) => {
  try {
    const response = await api.post(`/reservations/${reservationId}/assign`, { partnerId });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to assign partner',
      errors: error.response?.data?.errors,
    };
  }
};

