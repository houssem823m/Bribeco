import api from './axios';

/**
 * Get all services
 */
export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch services',
    };
  }
};

/**
 * Get service by ID
 */
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch service',
    };
  }
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch categories',
    };
  }
};

