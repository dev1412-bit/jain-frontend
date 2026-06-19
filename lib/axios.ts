import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// Correct — separate the two URLs
const API_URL  = process.env.NEXT_PUBLIC_API_URL ;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;

export const initCsrf = async () => {
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {  // no /api prefix
    withCredentials: true,
  });
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach XSRF token to every mutating request
api.interceptors.request.use((config) => {
  const xsrf = document.cookie
    .split("; ")
    .find((r) => r.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (xsrf) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrf);
  }

  return config;
});

// 401 → auto logout
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;