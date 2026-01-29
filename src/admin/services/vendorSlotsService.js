import apiService from './apiService';

/**
 * Vendor Slots Service
 * Handles all vendor slot-related API calls
 * Matches the backend API at: https://startup-backend-odvu.onrender.com
 */

export const vendorSlotsService = {
    // Get available slots for a vendor on a specific date
    getAvailable: async (vendorId, date) => {
        // date should be in YYYY-MM-DD format
        return apiService.get(`/vendor-slots/available?vendorId=${vendorId}&date=${date}`);
    },

    // Create a new slot (for vendors)
    create: async (vendorId, date, startTime, endTime) => {
        const params = new URLSearchParams({
            vendorId: vendorId.toString(),
            date: date,
            startTime: startTime,
            endTime: endTime
        });
        return apiService.post(`/vendor-slots/create?${params.toString()}`, {});
    },

    // Edit an existing slot
    update: async (slotId, updates = {}) => {
        const params = new URLSearchParams();
        if (updates.date) params.append('date', updates.date);
        if (updates.startTime) params.append('startTime', updates.startTime);
        if (updates.endTime) params.append('endTime', updates.endTime);
        if (updates.status) params.append('status', updates.status);

        const queryString = params.toString();
        return apiService.put(`/vendor-slots/edit/${slotId}${queryString ? `?${queryString}` : ''}`, {});
    },

    // Delete a slot
    delete: async (slotId) => {
        return apiService.delete(`/vendor-slots/delete/${slotId}`);
    }
};

export default vendorSlotsService;
