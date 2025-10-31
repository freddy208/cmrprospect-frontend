/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from "axios";
import type { DashboardStats, DashboardFilter } from "@/types/dashboard";
import type { Prospect, ProspectFilter, CreateProspectData, UpdateProspectData } from "@/types/prospect";
import { CreateInteractionData, InteractionFilter, UpdateInteractionData, Interaction} from "@/types/interaction";
import { CreateCommentData, CommentFilter, UpdateCommentData, Comment } from "@/types/comment";

import { CreateFormationData, FormationFilter, UpdateFormationData, Formation, FormationStatsByCountry, FormationProspectStats, FormationStatsByManager } from "@/types/formation";


import { CreateSimulateurData, SimulateurFilter, UpdateSimulateurData, Simulateur, SimulateurStatsByCountry, SimulateurProspectStats, SimulateurStatsByManager } from "@/types/simulateur";



const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // cookies httpOnly envoyés automatiquement
  headers: {
    "Content-Type": "application/json",
  },
});
// src/lib/api.ts
export async function getCurrentUser() {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

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

// src/lib/api.ts

// ... (imports et configuration axios inchangés)

// --- NOUVELLES FONCTIONS POUR LE MODULE INTERACTION ---

export async function getInteractions(filter?: InteractionFilter) {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const url = `/interactions${queryString ? `?${queryString}` : ''}`;
  const response = await api.get<Interaction[]>(url);
  return response.data;
}

// src/lib/api.ts
export async function createInteraction(data: CreateInteractionData) {
  try {
    const response = await api.post<Interaction>('/interactions', data);
    // S'assurer que la réponse contient les informations de l'utilisateur
    if (!response.data.user) {
      // Récupérer les informations de l'utilisateur depuis le hook useAuth ou depuis une autre source
      // et les ajouter à l'objet interaction
      const user = await getCurrentUser(); // Vous devrez implémenter cette fonction
      response.data.user = user;
    }
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'interaction:", error);
    throw error;
  }
}

export async function updateInteraction(id: string, data: UpdateInteractionData) {
  const response = await api.patch<Interaction>(`/interactions/${id}`, data);
  return response.data;
}

export async function deleteInteraction(id: string) {
  // Le backend fait un soft-delete, donc on peut s'attendre à une réponse 204 No Content ou un objet mis à jour.
  const response = await api.delete(`/interactions/${id}`);
  return response.data;
}

export async function getInteractionCountByProspect(prospectId: string) {
  const response = await api.get<{ count: number }>(`/interactions/count/prospect/${prospectId}`);
  return response.data.count; // L'API renvoie probablement un nombre, pas un objet
}

export async function getInteractionCountByUser(userId: string) {
  const response = await api.get<{ count: number }>(`/interactions/count/user/${userId}`);
  return response.data.count;
}

// --- ANCIENNES FONCTIONS À SUPPRIMER OU REMPLACER ---

// La fonction getInteractionsForProspect est remplacée par getInteractions({ prospectId })
// export async function getInteractionsForProspect(prospectId: string) { ... }

// La fonction addInteractionToProspect est remplacée par createInteraction
// export async function addInteractionToProspect(prospectId: string, data: any) { ... }

// ... (le reste du fichier est inchangé)


// --- NOUVELLES FONCTIONS POUR LE MODULE COMMENT ---

export async function getComments(filter?: CommentFilter) {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const url = `/comments${queryString ? `?${queryString}` : ''}`;
  const response = await api.get<Comment[]>(url);
  return response.data;
}

export async function createComment(data: CreateCommentData) {
  try {
    const response = await api.post<Comment>('/comments', data);
    // S'assurer que la réponse contient les informations de l'utilisateur
    if (!response.data.user) {
      const user = await getCurrentUser();
      response.data.user = user;
    }
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    throw error;
  }
}

export async function updateComment(id: string, data: UpdateCommentData) {
  const response = await api.patch<Comment>(`/comments/${id}`, data);
  return response.data;
}

export async function deleteComment(id: string) {
  // Le backend fait un soft-delete, donc on peut s'attendre à une réponse 204 No Content ou un objet mis à jour.
  const response = await api.delete(`/comments/${id}`);
  return response.data;
}

export async function getCommentCountByProspect(prospectId: string) {
  const response = await api.get<{ count: number }>(`/comments/count/prospect/${prospectId}`);
  return response.data.count;
}

export async function getCommentCountByUser(userId: string) {
  const response = await api.get<{ count: number }>(`/comments/count/user/${userId}`);
  return response.data.count;
}

// --- ANCIENNES FONCTIONS À SUPPRIMER OU REMPLACER ---

// La fonction getCommentsForProspect est remplacée par getComments({ prospectId })
// export async function getCommentsForProspect(prospectId: string) { ... }

// La fonction addCommentToProspect est remplacée par createComment
// export async function addCommentToProspect(prospectId: string, content: string) { ... }

// ... (le reste du fichier est inchangé)

// src/lib/api.ts

// ... (imports existants)

// ... (code existant)

// --- NOUVELLES FONCTIONS POUR LE MODULE FORMATION ---

export async function getFormations(filter?: FormationFilter) {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const url = `/formations${queryString ? `?${queryString}` : ''}`;
  const response = await api.get<Formation[]>(url);
  return response.data;
}

export async function getFormation(id: string) {
  const response = await api.get<Formation>(`/formations/${id}`);
  return response.data;
}

export async function createFormation(data: CreateFormationData) {
  try {
    const response = await api.post<Formation>('/formations', data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la formation:", error);
    throw error;
  }
}

export async function updateFormation(id: string, data: UpdateFormationData) {
  const response = await api.patch<Formation>(`/formations/${id}`, data);
  return response.data;
}

export async function deleteFormation(id: string) {
  // Le backend fait un soft-delete, donc on peut s'attendre à une réponse 204 No Content ou un objet mis à jour.
  const response = await api.delete(`/formations/${id}`);
  return response.data;
}

// --- FONCTIONS POUR LES STATISTIQUES ---

export async function getFormationStatsByCountry() {
  const response = await api.get<FormationStatsByCountry[]>('/formations/stats/by-country');
  return response.data;
}

export async function getFormationStatsByManager() {
  const response = await api.get<FormationStatsByManager[]>('/formations/stats/by-manager');
  return response.data;
}

export async function getFormationTotalCount() {
  const response = await api.get<{ count: number }>('/formations/stats/total');
  return response.data.count;
}

export async function getFormationProspectStats() {
  const response = await api.get<FormationProspectStats[]>('/formations/stats/prospects');
  return response.data;
}

export async function getFormationProspectStatsByCountry(country: string) {
  const response = await api.get<FormationProspectStats[]>(`/formations/stats/prospects/${country}`);
  return response.data;
}

// --- NOUVELLES FONCTIONS POUR LE MODULE SIMULATEUR ---

export async function getSimulateurs(filter?: SimulateurFilter) {
  const params = new URLSearchParams();
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const queryString = params.toString();
  const url = `/simulateurs${queryString ? `?${queryString}` : ''}`;
  const response = await api.get<Simulateur[]>(url);
  return response.data;
}

export async function getSimulateur(id: string) {
  const response = await api.get<Simulateur>(`/simulateurs/${id}`);
  return response.data;
}

export async function createSimulateur(data: CreateSimulateurData) {
  try {
    const response = await api.post<Simulateur>('/simulateurs', data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du simulateur:", error);
    throw error;
  }
}

export async function updateSimulateur(id: string, data: UpdateSimulateurData) {
  const response = await api.patch<Simulateur>(`/simulateurs/${id}`, data);
  return response.data;
}

export async function deleteSimulateur(id: string) {
  // Le backend fait un soft-delete, donc on peut s'attendre à une réponse 204 No Content ou un objet mis à jour.
  const response = await api.delete(`/simulateurs/${id}`);
  return response.data;
}

// --- FONCTIONS POUR LES STATISTIQUES ---

export async function getSimulateurStatsByCountry() {
  const response = await api.get<SimulateurStatsByCountry[]>('/simulateurs/stats/by-country');
  return response.data;
}

export async function getSimulateurStatsByManager() {
  const response = await api.get<SimulateurStatsByManager[]>('/simulateurs/stats/by-manager');
  return response.data;
}

export async function getSimulateurTotalCount() {
  const response = await api.get<{ count: number }>('/simulateurs/stats/total');
  return response.data.count;
}

export async function getSimulateurProspectStats() {
  const response = await api.get<SimulateurProspectStats[]>('/simulateurs/stats/prospects');
  return response.data;
}

export async function getSimulateurProspectStatsByCountry(country: string) {
  const response = await api.get<SimulateurProspectStats[]>(`/simulateurs/stats/prospects/${country}`);
  return response.data;
}


export default api;