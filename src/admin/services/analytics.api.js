import secureApi from "../../api/secureApi";

// 📊 High-level analytics (cards)
export const getAnalytics = async () => {
  const bookings = await secureApi.get("/bookings/all");
  const vendors = await secureApi.get("/admin/vendor/status/APPROVED");

  return {
    totalBookings: bookings.data.length,
    totalVendors: vendors.data.length
  };
};

// 📈 Detailed booking analytics (charts)
export const getBookingStats = async () => {
  const res = await secureApi.get("/bookings/all");
  return res.data; // full bookings list
};
