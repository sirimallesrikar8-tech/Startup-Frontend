import secureApi from "../../api/secureApi";

export const getVendorsByStatus = (status) =>
  secureApi.get(`/admin/vendor/status/${status}`);

export const approveVendor = (vendorId) =>
  secureApi.post(`/admin/vendor/${vendorId}/approve`);

export const rejectVendor = (vendorId) =>
  secureApi.post(`/admin/vendor/${vendorId}/reject`);

export const updateVendorStatus = (vendorId, status) =>
  secureApi.patch(`/admin/vendor/${vendorId}/status`, null, {
    params: { status }
  });
