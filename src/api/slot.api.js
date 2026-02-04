import api from "./axios";

/**
 * Create a vendor time slot
 * POST /api/vendor-slots/create
 * Params: vendorId, date (YYYY-MM-DD), startTime (ISO), endTime (ISO)
 */
export const createVendorSlot = ({ vendorId, date, startTime, endTime }) => {
  return api.post("/api/vendor-slots/create", null, {
    params: {
      vendorId,
      date,        // YYYY-MM-DD
      startTime,   // ISO string (e.g., 2026-01-17T10:00:00)
      endTime      // ISO string (e.g., 2026-01-17T11:00:00)
    }
  });
};

// Alias for backward compatibility
export const saveVendorSlot = createVendorSlot;

/**
 * Get available slots for a vendor on a specific date
 * GET /api/vendor-slots/available
 * Params: vendorId, date (YYYY-MM-DD)
 */
export const getVendorSlots = (vendorId, date) => {
  return api.get("/api/vendor-slots/available", {
    params: {
      vendorId,
      date         // REQUIRED by backend (YYYY-MM-DD)
    }
  });
};

/**
 * Edit a vendor slot
 * PUT /api/vendor-slots/edit/{slotId}
 * Optional Query Params: date, startTime, endTime, status (AVAILABLE|BOOKED|BLOCKED)
 */
export const editVendorSlot = (slotId, { date, startTime, endTime, status }) => {
  const params = {};
  if (date) params.date = date;
  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;
  if (status) params.status = status;

  return api.put(`/api/vendor-slots/edit/${slotId}`, null, { params });
};

/**
 * Delete a vendor slot
 * DELETE /api/vendor-slots/delete/{slotId}
 */
export const deleteVendorSlot = (slotId) => {
  return api.delete(`/api/vendor-slots/delete/${slotId}`);
};
