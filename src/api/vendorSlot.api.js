import api from "./axios";

/* Create vendor availability slot */
export const createVendorSlot = (data) =>
  api.post("/api/vendor-slots/create", data);

/* Get available slots */
export const getAvailableVendorSlots = (params) =>
  api.get("/api/vendor-slots/available", { params });
