import api from './axios';

/**
 * Get current partner info (by finding partner with current user ID)
 * Note: This requires a backend endpoint /api/partners/me or we need to get it differently
 */
export const getCurrentPartner = async () => {
  try {
    // Try to get current partner - we'll need backend support for this
    // For now, we'll need to add a /partners/me endpoint or get it from user context
    // This is a placeholder - the backend should provide this endpoint
    const response = await api.get('/partners/me');
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    // If endpoint doesn't exist, return error
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch partner info',
    };
  }
};

/**
 * Get partner assignments
 */
export const getPartnerAssignments = async (partnerId) => {
  try {
    const response = await api.get(`/partners/${partnerId}/assignments`);
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch assignments',
    };
  }
};

/**
 * Respond to assignment (accept/reject)
 */
export const respondToAssignment = async (assignmentId, action) => {
  try {
    const response = await api.post(`/partners/assignments/${assignmentId}/respond`, {
      action,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to respond to assignment',
    };
  }
};

