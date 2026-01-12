import axios from "axios";

// const BASE_URL = "http://0.0.0.0:8000/api/";
const BASE_URL = "http://localhost:3000/api"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;