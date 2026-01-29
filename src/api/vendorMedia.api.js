import api from "./axios";

/* ✅ Upload vendor media (Swagger-aligned) */
export const uploadVendorMedia = (vendorId, file, caption = "") => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(
    `/api/vendor-media/upload?vendorId=${vendorId}&caption=${caption}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

/* ✅ Get vendor media */
export const getVendorMedia = (vendorId) => {
  return api.get(`/api/vendor-media/vendor/${vendorId}`);
};

/* ✅ Delete vendor media */
export const deleteVendorMedia = (mediaId) => {
  return api.delete(`/api/vendor-media/${mediaId}`);
};
