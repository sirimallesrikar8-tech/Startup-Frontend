import api from "./axios";

/* Get vendor details (GST, PAN/TAN, Aadhaar) */
export const getVendorDetails = (userId) =>
    api.get(`/api/vendor/details/${userId}`);

/* Add vendor details */
export const addVendorDetails = (userId, data) =>
    api.post(`/api/vendor/details/${userId}`, data);

/* Update vendor details */
export const updateVendorDetails = (userId, data) =>
    api.put(`/api/vendor/details/${userId}`, data);

/* Delete vendor details */
export const deleteVendorDetails = (userId) =>
    api.delete(`/api/vendor/details/${userId}`);
