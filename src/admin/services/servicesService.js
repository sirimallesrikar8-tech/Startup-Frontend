import apiService from './apiService';

/**
 * Services Service
 * Handles all service-related API calls
 */

export const servicesService = {
    // Get all services
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/services${queryParams ? `?${queryParams}` : ''}`;
        return apiService.get(endpoint);
    },

    // Get service by ID
    getById: async (id) => {
        return apiService.get(`/services/${id}`);
    },

    // Create new service
    create: async (serviceData) => {
        return apiService.post('/services', serviceData);
    },

    // Update service
    update: async (id, serviceData) => {
        return apiService.put(`/services/${id}`, serviceData);
    },

    // Delete service
    delete: async (id) => {
        return apiService.delete(`/services/${id}`);
    },

    // Get service statistics
    getStats: async () => {
        return apiService.get('/services/stats');
    },

    // Export services to CSV
    exportCSV: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiService.get(`/services/export${queryParams ? `?${queryParams}` : ''}`);
    }
};

export default servicesService;
