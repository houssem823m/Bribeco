import api from './axios';

/**
 * Get site content by page
 */
export const getSiteContent = async (page = 'home') => {
  try {
    const response = await api.get(`/site-content/${page}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch site content',
    };
  }
};

/**
 * Update site content
 */
export const updateSiteContent = async (page, content) => {
  try {
    const response = await api.put(`/admin/site-content/${page}`, { content });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update site content',
    };
  }
};

/**
 * Get admin overview stats
 */
export const getAdminOverview = async () => {
  try {
    const response = await api.get('/admin/overview');
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch overview',
    };
  }
};

/**
 * Get all partner requests
 */
export const getPartnerRequests = async (status) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/admin/partner-requests', { params });
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch partner requests',
    };
  }
};

/**
 * Accept partner request
 */
export const acceptPartnerRequest = async (requestId) => {
  try {
    const response = await api.put(`/admin/partner-requests/${requestId}/accept`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to accept partner request',
    };
  }
};

/**
 * Reject partner request
 */
export const rejectPartnerRequest = async (requestId) => {
  try {
    const response = await api.put(`/admin/partner-requests/${requestId}/reject`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reject partner request',
    };
  }
};

/**
 * Get all payments
 */
export const getAllPayments = async (status) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/admin/payments', { params });
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch payments',
    };
  }
};

/**
 * Service requests (reservations) management
 */
export const getServiceRequests = async (options = {}) => {
  try {
    const response = await api.get('/admin/reservations', { params: options });
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch service requests',
    };
  }
};

/**
 * Get all partners (for assignment)
 */
export const getAllPartners = async () => {
  try {
    const response = await api.get('/admin/partners');
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch partners',
    };
  }
};

/**
 * Get partner by ID (admin)
 */
export const getPartnerById = async (partnerId) => {
  try {
    const response = await api.get(`/admin/partners/${partnerId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch partner',
    };
  }
};

/**
 * Get partner assignments (admin)
 */
export const getPartnerAssignments = async (partnerId) => {
  try {
    const response = await api.get(`/admin/partners/${partnerId}/assignments`);
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch partner assignments',
    };
  }
};

/**
 * Category management
 */
export const createCategory = async (payload) => {
  try {
    const response = await api.post('/categories', payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create category',
      errors: error.response?.data?.errors,
    };
  }
};

export const updateCategory = async (id, payload) => {
  try {
    const response = await api.put(`/categories/${id}`, payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update category',
      errors: error.response?.data?.errors,
    };
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete category',
    };
  }
};

/**
 * Service management
 */
export const createService = async (payload) => {
  try {
    const response = await api.post('/services', payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create service',
      errors: error.response?.data?.errors,
    };
  }
};

export const updateService = async (id, payload) => {
  try {
    const response = await api.put(`/services/${id}`, payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update service',
      errors: error.response?.data?.errors,
    };
  }
};

export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete service',
    };
  }
};

/**
 * FAQ management
 */
export const getFaqs = async () => {
  try {
    const response = await api.get('/admin/faqs');
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch FAQs',
    };
  }
};

export const createFaq = async (payload) => {
  try {
    const response = await api.post('/admin/faqs', payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create FAQ',
      errors: error.response?.data?.errors,
    };
  }
};

export const updateFaq = async (id, payload) => {
  try {
    const response = await api.put(`/admin/faqs/${id}`, payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update FAQ',
      errors: error.response?.data?.errors,
    };
  }
};

export const deleteFaq = async (id) => {
  try {
    const response = await api.delete(`/admin/faqs/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete FAQ',
    };
  }
};

/**
 * Testimonials management
 */
export const getTestimonials = async () => {
  try {
    const response = await api.get('/admin/testimonials');
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch testimonials',
    };
  }
};

export const createTestimonial = async (payload) => {
  try {
    const response = await api.post('/admin/testimonials', payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create testimonial',
      errors: error.response?.data?.errors,
    };
  }
};

export const updateTestimonial = async (id, payload) => {
  try {
    const response = await api.put(`/admin/testimonials/${id}`, payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update testimonial',
      errors: error.response?.data?.errors,
    };
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await api.delete(`/admin/testimonials/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete testimonial',
    };
  }
};

