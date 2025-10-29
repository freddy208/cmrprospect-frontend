/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from "axios";

console.log('🌐 ==================== API CONFIG ====================');
console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('🌐 withCredentials: true');

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
    console.log('📤 ==================== REQUEST ====================');
    console.log('📤 Method:', config.method?.toUpperCase());
    console.log('📤 URL:', config.url);
    console.log('📤 Full URL:', config.url);
    console.log('📤 withCredentials:', config.withCredentials);
    console.log('📤 Headers:', config.headers);
    console.log('📤 Data:', config.data);
    
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
    console.log('📥 ==================== RESPONSE ====================');
    console.log('📥 URL:', response.config.url);
    console.log('📥 Status:', response.status);
    console.log('📥 Status Text:', response.statusText);
    console.log('📥 Headers:', response.headers);
    console.log('📥 Data brute:', response.data);
    console.log('📥 Set-Cookie header:', response.headers['set-cookie']);
    
    response.data = unwrapResponse(response.data);
    
    console.log('📥 Data après unwrap:', response.data);
    
    return response;
  },
  async (error) => {
    console.error('❌ ==================== RESPONSE ERROR ====================');
    console.error('❌ URL:', error.config?.url);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Status Text:', error.response?.statusText);
    console.error('❌ Data:', error.response?.data);
    console.error('❌ Headers:', error.response?.headers);
    
    const originalRequest = error.config;

    // Si 401 -> essayer refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 ==================== AUTO REFRESH ====================');
      console.log('🔄 Status 401 détecté, tentative de refresh...');
      
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
        console.error('❌ Refresh échoué:', refreshErr);
        console.error('❌ Refresh status:', refreshErr?.response?.status);
        console.error('❌ Refresh data:', refreshErr?.response?.data);
        
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