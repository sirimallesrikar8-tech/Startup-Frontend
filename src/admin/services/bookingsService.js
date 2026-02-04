import apiService from './apiService';

/**
 * Bookings Service
 * Handles all booking-related API calls
 * Matches the backend API at: https://startup-backend-odvu.onrender.com
 */

export const bookingsService = {
    // Get all bookings
    getAll: async () => {
        return apiService.get('/bookings/all');
    },

    // Get bookings by user ID
    getByUserId: async (userId) => {
        return apiService.get(`/bookings/user/${userId}`);
    },

    // Get bookings by vendor ID
    getByVendorId: async (vendorId) => {
        return apiService.get(`/bookings/vendor/${vendorId}`);
    },

    // Book a slot (userId and slotId are query params)
    bookSlot: async (userId, slotId) => {
        return apiService.post(`/bookings/book-slot?userId=${userId}&slotId=${slotId}`, {});
    },

    // Update booking status
    updateStatus: async (bookingId, status) => {
        return apiService.put(`/bookings/${bookingId}/status?status=${status}`, {});
    }
};

export default bookingsService;

