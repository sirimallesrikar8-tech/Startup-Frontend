import api from "./axios";

export const getBookingsByVendor = (vendorId) =>
  api.get(`/api/bookings/vendor/${vendorId}`);

export const updateBookingStatus = (bookingId, status) =>
  api.put(`/api/bookings/${bookingId}/status`, { status });
