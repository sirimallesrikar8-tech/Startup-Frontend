import axios from "axios";

const API = axios.create({
  baseURL: "https://startup-backend-odvu.onrender.com",
});

/* ✅ Automatically attach token */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* AUTH */
export const registerUser = (data) => {
  return API.post("/api/auth/register", data);
};

export const loginUser = (data) => {
  return API.post("/api/auth/login", data);
};

/* ✅ GET USER PROFILE (NEW) */
export const getUserProfile = (userId) => {
  return API.get(`/api/auth/profile/${userId}`);
};

/* ✅ UPLOAD PROFILE PICTURE (NEW) */
export const uploadProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(
    `/api/auth/upload-profile-picture/${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default API;
