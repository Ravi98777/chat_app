import axios from "axios";

export const url = "http://localhost:5000";

export const axiosInstance = axios.create({
  baseURL: url,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
