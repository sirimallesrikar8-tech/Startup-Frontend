import api from "./axios";

/**
 * Create a vendor time slot
 * POST /api/vendor-slots/create
 */
export const saveVendorSlot = ({ vendorId, date, startTime, endTime }) => {
  return api.post("/api/vendor-slots/create", null, {
    params: {
      vendorId,
      date,        // YYYY-MM-DD
      startTime,   // ISO string (seconds = 00)
      endTime      // ISO string (seconds = 00)
    }
  });
};

/**
 * Get available slots for a vendor on a specific date
 * GET /api/vendor-slots/available
 */
export const getVendorSlots = (vendorId, date) => {
  return api.get("/api/vendor-slots/available", {
    params: {
      vendorId,
      date         // REQUIRED by backend
    }
  });
};
export const deleteVendorSlot = (slotId) => {
  return api.delete(`/api/vendor-slots/${slotId}`);
};
