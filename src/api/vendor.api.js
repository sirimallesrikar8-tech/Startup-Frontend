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

/* Add review (optional – user side) */
export const addVendorReview = (vendorId, data) =>
  api.post(`/api/vendors/${vendorId}/reviews`, data);
