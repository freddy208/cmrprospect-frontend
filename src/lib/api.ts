/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from "axios";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // cookies httpOnly envoyés automatiquement
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper pour unwrap les réponses transformées par l'interceptor backend
function unwrapResponse(resp: any) {
  console.log('📦 Unwrapping response:', resp);
  
  // Si ton TransformInterceptor enveloppe en { success, data, meta }
  if (resp && typeof resp === "object") {
    if ("data" in resp && Object.keys(resp).length > 1) {
      console.log('📦 Unwrap: structure multiple keys avec data');
      return resp.data ?? resp;
    }
    if ("data" in resp && Object.keys(resp).length === 1) {
      console.log('📦 Unwrap: structure single key data');
      return resp.data;
    }
  }
  
  console.log('📦 Unwrap: retour direct');
  return resp;
}

// Interceptor de requête pour debug
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

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
        console.log('🔄 Appel à /auth/refresh...');
        
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        console.log('✅ Refresh réussi, retry de la requête originale');
        
        // retry original request
        return api(originalRequest);
      } catch (refreshErr: any) {
        // Redirection vers login si on est pas déjà dessus
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          console.log('🔴 Redirection vers /login...');
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;