import api from "./axios";

/* Get all bookings for a vendor */
export const getBookingsByVendor = (vendorId) =>
  api.get(`/api/bookings/vendor/${vendorId}`);

/* Get all bookings for a user */
export const getBookingsByUser = (userId) =>
  api.get(`/api/bookings/user/${userId}`);

/* Update booking status (Accept/Reject) - status as query param */
export const updateBookingStatus = (bookingId, status) =>
  api.put(`/api/bookings/${bookingId}/status`, null, { params: { status } });

/* Book a slot */
export const bookSlot = (userId, slotId) =>
  api.post(`/api/bookings/book-slot`, null, { params: { userId, slotId } });

/* Get all bookings (admin) */
export const getAllBookings = () =>
  api.get(`/api/bookings/all`);
