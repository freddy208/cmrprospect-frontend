/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from "axios";
import type { DashboardStats, DashboardFilter } from "@/types/dashboard";
import type { Prospect, ProspectFilter, CreateProspectData, UpdateProspectData } from "@/types/prospect";
import type { Interaction, Comment } from "@/types/index" // On créera ces types plus tard



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

export async function getDashboardStats(filter?: DashboardFilter) {
  // L'intercepteur s'occupera d'ajouter le filtre à l'URL si nécessaire
  const params = new URLSearchParams();
  if (filter?.startDate) params.append('startDate', filter.startDate);
  if (filter?.endDate) params.append('endDate', filter.endDate);

  const queryString = params.toString();
  const url = `/dashboard/stats${queryString ? `?${queryString}` : ''}`;

 const response = await api.get<DashboardStats>(url); // <--- CETTE LIGNE EST CORRECTE
  return response.data;
}
export async function getProspects(filter?: ProspectFilter) {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
  }
  const queryString = params.toString();
  const url = `/prospects${queryString ? `?${queryString}` : ''}`;
  const response = await api.get<Prospect[]>(url);
  return response.data;
}
export async function getProspectsEntreprises(filter?: ProspectFilter) {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
  }
  const queryString = params.toString();
  const url = `/prospects/entreprises${queryString ? `?${queryString}` : ''}`;
  const response = await api.get<Prospect[]>(url);
  return response.data;
}
export async function getProspectsAboutis(filter?: ProspectFilter) {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
  }
  const queryString = params.toString();
  const url = `/prospects/aboutis${queryString ? `?${queryString}` : ''}`;
  const response = await api.get<Prospect[]>(url);
  return response.data;
}

export async function getProspect(id: string) {
  const response = await api.get<Prospect>(`/prospects/${id}`);
  return response.data;
}

// Dans src/lib/api.ts, modifiez la fonction createProspect comme suit :

export async function createProspect(data: CreateProspectData) {
  try {
    console.log("Données envoyées à l'API:", data);
    const response = await api.post<Prospect>('/prospects', data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du prospect:", error);
    throw error;
  }
}

export async function updateProspect(id: string, data: UpdateProspectData) {
  const response = await api.patch<Prospect>(`/prospects/${id}`, data);
  return response.data;
}

export async function deleteProspect(id: string) {
  const response = await api.delete(`/prospects/${id}`);
  return response.data;
}

// --- ACTIONS MÉTIER ---

export async function assignProspect(id: string, assignedToId: string) {
  const response = await api.patch<Prospect>(`/prospects/${id}/assign`, { assignedToId });
  return response.data;
}

export async function convertProspect(id: string) {
  const response = await api.patch<Prospect>(`/prospects/${id}/convert`);
  return response.data;
}

// --- DONNÉES ASSOCIÉES ---

export async function getInteractionsForProspect(prospectId: string) {
  // --- CORRECTION : Ajouter le type générique Interaction[] ---
  // On dit à TypeScript que l'intercepteur va nous retourner un tableau direct.
  const response = await api.get<Interaction[]>(`/prospects/${prospectId}/interactions`);
  return response.data;
}


export async function getCommentsForProspect(prospectId: string) {
  const response = await api.get<Comment[]>(`/prospects/${prospectId}/comments`);
  
  return response.data ?? []; 
}

// ... (le reste du fichier est inchangé)
export async function addCommentToProspect(prospectId: string, content: string) {
  // On suppose que l'endpoint pour créer un commentaire est /comments
  const response = await api.post<Comment>('/comments', { content, prospectId });
  return response.data;
}

export async function addInteractionToProspect(prospectId: string, data: any) {
  // On suppose que l'endpoint pour créer une interaction est /interactions
  const response = await api.post<Interaction>('/interactions', { ...data, prospectId });
  return response.data;
}

export default api;