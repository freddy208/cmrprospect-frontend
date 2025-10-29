/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ex: https://api.example.com/api/v1
  withCredentials: true, // cookies httpOnly envoyés automatiquement
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper pour unwrap les réponses transformées par l'interceptor backend
function unwrapResponse(resp: any) {
  // Si ton TransformInterceptor enveloppe en { success, data, meta }
  if (resp && typeof resp === "object") {
    if ("data" in resp && Object.keys(resp).length > 1) {
      // probable structure { success, data, ... }
      return resp.data ?? resp;
    }
    // parfois backend renvoie { data: {...} } ou directement payload
    if ("data" in resp && Object.keys(resp).length === 1) {
      return resp.data;
    }
  }
  return resp;
}

// Response interceptor : unwrap and return resp.data equivalent
api.interceptors.response.use(
  (response) => {
    response.data = unwrapResponse(response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si 401 -> essayer refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // call refresh endpoint (backend doit lire refreshToken cookie)
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        // retry original request
        return api(originalRequest);
      } catch (refreshErr) {
        // refresh failed -> forward original error
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
