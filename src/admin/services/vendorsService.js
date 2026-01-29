import apiService from './apiService';

/**
 * Vendors Service
 * Handles all vendor-related API calls
 * Matches the backend API at: https://startup-backend-odvu.onrender.com
 */

export const vendorsService = {
    // Search vendors by name
    search: async (name) => {
        return apiService.get(`/vendors/search?name=${encodeURIComponent(name)}`);
    },

    // Get vendors by location
    getByLocation: async (location) => {
        return apiService.get(`/vendors/location?location=${encodeURIComponent(location)}`);
    },

    // Get vendors by status (PENDING, APPROVED, REJECTED)
    getByStatus: async (status) => {
        return apiService.get(`/vendors/status/${status}`);
    },

    // Get vendor by ID
    getById: async (vendorId) => {
        return apiService.get(`/vendors/${vendorId}`);
    },

    // Get vendor rating
    getRating: async (vendorId) => {
        return apiService.get(`/vendors/${vendorId}/rating`);
    },

    // Get vendor reviews
    getReviews: async (vendorId) => {
        return apiService.get(`/vendors/${vendorId}/reviews`);
    },

    // Post a review for a vendor
    addReview: async (vendorId, reviewData) => {
        // reviewData: { userId, rating, review }
        return apiService.post(`/vendors/${vendorId}/reviews`, reviewData);
    },

    // Get vendor media/images
    getMedia: async (vendorId) => {
        return apiService.get(`/vendor-media/vendor/${vendorId}`);
    },

    // Get all approved vendors (for public listing)
    getAllApproved: async () => {
        return apiService.get('/vendors/status/APPROVED');
    }
};

export default vendorsService;

