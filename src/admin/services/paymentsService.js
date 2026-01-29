import apiService from './apiService';

/**
 * Payments Service
 * Handles all payment-related API calls
 */

export const paymentsService = {
    // Get all payments
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/payments${queryParams ? `?${queryParams}` : ''}`;
        return apiService.get(endpoint);
    },

    // Get payment by ID
    getById: async (id) => {
        return apiService.get(`/payments/${id}`);
    },

    // Create new payment
    create: async (paymentData) => {
        return apiService.post('/payments', paymentData);
    },

    // Update payment
    update: async (id, paymentData) => {
        return apiService.put(`/payments/${id}`, paymentData);
    },

    // Mark payment as paid
    markAsPaid: async (id) => {
        return apiService.put(`/payments/${id}/mark-paid`, {});
    },

    // Process refund
    refund: async (id, amount, reason) => {
        return apiService.post(`/payments/${id}/refund`, { amount, reason });
    },

    // Get payment statistics
    getStats: async () => {
        return apiService.get('/payments/stats');
    },

    // Export payments to CSV
    exportCSV: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiService.get(`/payments/export${queryParams ? `?${queryParams}` : ''}`);
    },

    // Send receipt
    sendReceipt: async (id) => {
        return apiService.post(`/payments/${id}/send-receipt`, {});
    }
};

export default paymentsService;
