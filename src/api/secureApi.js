import axios from "axios";

const secureApi = axios.create({
  baseURL: "https://startup-backend-odvu.onrender.com/api"
});

// attach token
secureApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🔥 let browser set multipart boundary automatically
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default secureApi;
