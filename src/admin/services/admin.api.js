import secureApi from "../../api/secureApi";

export const getAdminProfile = (userId) =>
  secureApi.get(`/auth/profile/${userId}`);

export const uploadProfilePicture = (userId, file) => {
  const formData = new FormData();

  // ✅ MUST be "file" (Swagger confirmed)
  formData.append("file", file);

  return secureApi.post(
    `/auth/upload-profile-picture/${userId}`,
    formData
  );
};
