import api from "./axios";

/* Get vendor by vendorId */
export const getVendorById = (vendorId) =>
  api.get(`/api/vendors/${vendorId}`);

/* Get vendor rating */
export const getVendorRating = (vendorId) =>
  api.get(`/api/vendors/${vendorId}/rating`);

/* Get vendor reviews */
export const getVendorReviews = (vendorId) =>
  api.get(`/api/vendors/${vendorId}/reviews`);

/* Add review (user side) */
export const addVendorReview = (vendorId, data) =>
  api.post(`/api/vendors/${vendorId}/reviews`, data);

/* Update vendor details */
export const updateVendor = (vendorId, data) =>
  api.put(`/api/vendors/${vendorId}`, data);

/* Search vendors by name */
export const searchVendorsByName = (name) =>
  api.get(`/api/vendors/search/name`, { params: { name } });

/* Search vendors by location */
export const searchVendorsByLocation = (location) =>
  api.get(`/api/vendors/search/location`, { params: { location } });
