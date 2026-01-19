import axios from "axios";

// const BASE_URL = "http://0.0.0.0:8000/api/";
const BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL, // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // must match login storage key

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
