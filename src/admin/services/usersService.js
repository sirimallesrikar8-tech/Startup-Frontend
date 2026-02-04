import apiService from './apiService';

/**
 * Users Service
 * Handles all user-related API calls
 */

export const usersService = {
    // Get all users
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/users${queryParams ? `?${queryParams}` : ''}`;
        return apiService.get(endpoint);
    },

    // Get user by ID
    getById: async (id) => {
        return apiService.get(`/users/${id}`);
    },

    // Create new user
    create: async (userData) => {
        return apiService.post('/users', userData);
    },

    // Update user
    update: async (id, userData) => {
        return apiService.put(`/users/${id}`, userData);
    },

    // Delete user
    delete: async (id) => {
        return apiService.delete(`/users/${id}`);
    },

    // Get user statistics
    getStats: async () => {
        return apiService.get('/users/stats');
    },

    // Export users to CSV
    exportCSV: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiService.get(`/users/export${queryParams ? `?${queryParams}` : ''}`);
    }
};

export default usersService;
