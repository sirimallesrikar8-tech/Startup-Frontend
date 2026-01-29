import axios from "axios";

const secureApi = axios.create({
  baseURL: "https://startup-backend-odvu.onrender.com",
});

secureApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default secureApi;
