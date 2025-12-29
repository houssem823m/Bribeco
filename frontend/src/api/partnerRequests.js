import api from './axios';

/**
 * Create a partner request
 * @param {Object} formData - Form data with service_type, experience_years, message, and cv_file
 * @returns {Promise<Object>} Response with success status and data/message
 */
export const createPartnerRequest = async (formData) => {
  try {
    const response = await api.post('/partner-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data.data, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la création de la demande de partenariat',
      errors: error.response?.data?.errors,
    };
  }
};


