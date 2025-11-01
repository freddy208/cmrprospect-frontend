/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useSimulateurs.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { 
  getSimulateurs, 
  getSimulateur, 
  createSimulateur, 
  updateSimulateur, 
  deleteSimulateur,
  getSimulateurStatsByCountry,
  getSimulateurStatsByManager,
  getSimulateurTotalCount,
  getSimulateurProspectStats,
  getSimulateurProspectStatsByCountry
} from "@/lib/api";
import { 
  Simulateur, 
  SimulateurFilter, 
  CreateSimulateurData, 
  UpdateSimulateurData,
  SimulateurStatsByCountry,
  SimulateurStatsByManager,
  SimulateurProspectStats
} from "@/types/simulateur";

type UseSimulateursOptions = {
  initialFilter?: SimulateurFilter;
  autoFetch?: boolean;
};

type UseSimulateursReturn = {
  simulateurs: Simulateur[];
  isLoading: boolean;
  error: string | null;
  refetch: (newFilter?: SimulateurFilter) => Promise<void>;
  create: (data: CreateSimulateurData) => Promise<Simulateur | null>;
  update: (id: string, data: UpdateSimulateurData) => Promise<Simulateur | null>;
  remove: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<Simulateur | null>;
  stats: {
    byCountry: SimulateurStatsByCountry[];
    byManager: SimulateurStatsByManager[];
    totalCount: number;
    prospectStats: SimulateurProspectStats[];
  };
  fetchStats: () => Promise<void>;
  fetchProspectStatsByCountry: (country: string) => Promise<SimulateurProspectStats[]>;
};

export function useSimulateurs({ initialFilter, autoFetch = true }: UseSimulateursOptions = {}): UseSimulateursReturn {
  const { user } = useAuth();
  const [simulateurs, setSimulateurs] = useState<Simulateur[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SimulateurFilter>(initialFilter || {});
  
  // États pour les statistiques
  const [statsByCountry, setStatsByCountry] = useState<SimulateurStatsByCountry[]>([]);
  const [statsByManager, setStatsByManager] = useState<SimulateurStatsByManager[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [prospectStats, setProspectStats] = useState<SimulateurProspectStats[]>([]);

  const fetchSimulateurs = useCallback(async (currentFilter: SimulateurFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSimulateurs(currentFilter);
      setSimulateurs(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des simulateurs:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setSimulateurs([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (autoFetch) {
      fetchSimulateurs(filter);
    }
  }, [fetchSimulateurs, filter, autoFetch]);

 const refetch = useCallback(async (newFilter?: SimulateurFilter) => {
  const finalFilter = newFilter || filter;
  setFilter(finalFilter);
  await fetchSimulateurs(finalFilter);
}, [fetchSimulateurs, filter]);

  const createSimulateurHandler = useCallback(async (data: CreateSimulateurData): Promise<Simulateur | null> => {
    if (!user) return null;
    try {
      const newSimulateur = await createSimulateur(data);
      setSimulateurs(prev => [newSimulateur, ...prev]);
      return newSimulateur;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
      return null;
    }
  }, [user]);

  const updateSimulateurHandler = useCallback(async (id: string, data: UpdateSimulateurData): Promise<Simulateur | null> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return null;
    }
    
    try {
      const updatedSimulateur = await updateSimulateur(id, data);
      setSimulateurs(prev => prev.map(s => s.id === id ? updatedSimulateur : s));
      return updatedSimulateur;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour.");
      return null;
    }
  }, [user]);

  const deleteSimulateurHandler = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteSimulateur(id);
      setSimulateurs(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
      return false;
    }
  }, []);

  const getByIdHandler = useCallback(async (id: string): Promise<Simulateur | null> => {
    try {
      return await getSimulateur(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la récupération du simulateur.");
      return null;
    }
  }, []);

  const fetchStatsHandler = useCallback(async () => {
    try {
      const [byCountry, byManager, total, prospectStats] = await Promise.all([
        getSimulateurStatsByCountry(),
        getSimulateurStatsByManager(),
        getSimulateurTotalCount(),
        getSimulateurProspectStats()
      ]);
      
      setStatsByCountry(byCountry);
      setStatsByManager(byManager);
      setTotalCount(total);
      setProspectStats(prospectStats);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des statistiques:", err);
    }
  }, []);

  const fetchProspectStatsByCountryHandler = useCallback(async (country: string): Promise<SimulateurProspectStats[]> => {
    try {
      return await getSimulateurProspectStatsByCountry(country);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des statistiques par pays:", err);
      return [];
    }
  }, []);

  return {
    simulateurs,
    isLoading,
    error,
    refetch,
    create: createSimulateurHandler,
    update: updateSimulateurHandler,
    remove: deleteSimulateurHandler,
    getById: getByIdHandler,
    stats: {
      byCountry: statsByCountry,
      byManager: statsByManager,
      totalCount,
      prospectStats
    },
    fetchStats: fetchStatsHandler,
    fetchProspectStatsByCountry: fetchProspectStatsByCountryHandler
  };
}

// Hook spécialisé pour les simulateurs par pays
export function useSimulateursByCountry(country: string) {
  return useSimulateurs({ initialFilter: { country } });
}