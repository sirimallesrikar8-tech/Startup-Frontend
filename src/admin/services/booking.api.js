import secureApi from "../../api/secureApi";

export const getAllBookings = () =>
  secureApi.get("/bookings/all");

export const updateBookingStatus = (bookingId, status) =>
  secureApi.put(`/bookings/${bookingId}/status`, { status });
