/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useFormations.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { 
  getFormations, 
  getFormation, 
  createFormation, 
  updateFormation, 
  deleteFormation,
  getFormationStatsByCountry,
  getFormationStatsByManager,
  getFormationTotalCount,
  getFormationProspectStats,
  getFormationProspectStatsByCountry
} from "@/lib/api";
import { 
  Formation, 
  FormationFilter, 
  CreateFormationData, 
  UpdateFormationData,
  FormationStatsByCountry,
  FormationStatsByManager,
  FormationProspectStats
} from "@/types/formation";

type UseFormationsOptions = {
  initialFilter?: FormationFilter;
  autoFetch?: boolean;
};

type UseFormationsReturn = {
  formations: Formation[];
  isLoading: boolean;
  error: string | null;
  refetch: (newFilter?: FormationFilter) => Promise<void>;
  create: (data: CreateFormationData) => Promise<Formation | null>;
  update: (id: string, data: UpdateFormationData) => Promise<Formation | null>;
  remove: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<Formation | null>;
  stats: {
    byCountry: FormationStatsByCountry[];
    byManager: FormationStatsByManager[];
    totalCount: number;
    prospectStats: FormationProspectStats[];
  };
  fetchStats: () => Promise<void>;
  fetchProspectStatsByCountry: (country: string) => Promise<FormationProspectStats[]>;
};

export function useFormations({ initialFilter, autoFetch = true }: UseFormationsOptions = {}): UseFormationsReturn {
  const { user } = useAuth();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FormationFilter>(initialFilter || {});
  
  // États pour les statistiques
  const [statsByCountry, setStatsByCountry] = useState<FormationStatsByCountry[]>([]);
  const [statsByManager, setStatsByManager] = useState<FormationStatsByManager[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [prospectStats, setProspectStats] = useState<FormationProspectStats[]>([]);

  const fetchFormations = useCallback(async (currentFilter: FormationFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFormations(currentFilter);
      setFormations(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des formations:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setFormations([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (autoFetch) {
      fetchFormations(filter);
    }
  }, [fetchFormations, filter, autoFetch]);

const refetch = useCallback(async (newFilter?: FormationFilter) => {
  const finalFilter = newFilter || filter;
  setFilter(finalFilter);
  await fetchFormations(finalFilter);
}, [fetchFormations, filter]);

  const createFormationHandler = useCallback(async (data: CreateFormationData): Promise<Formation | null> => {
    if (!user) return null;
    try {
      const newFormation = await createFormation(data);
      setFormations(prev => [newFormation, ...prev]);
      return newFormation;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
      return null;
    }
  }, [user]);

  const updateFormationHandler = useCallback(async (id: string, data: UpdateFormationData): Promise<Formation | null> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return null;
    }
    
    try {
      const updatedFormation = await updateFormation(id, data);
      setFormations(prev => prev.map(f => f.id === id ? updatedFormation : f));
      return updatedFormation;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour.");
      return null;
    }
  }, [user]);

  const deleteFormationHandler = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteFormation(id);
      setFormations(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
      return false;
    }
  }, []);

  const getByIdHandler = useCallback(async (id: string): Promise<Formation | null> => {
    try {
      return await getFormation(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la récupération de la formation.");
      return null;
    }
  }, []);

  const fetchStatsHandler = useCallback(async () => {
    try {
      const [byCountry, byManager, total, prospectStats] = await Promise.all([
        getFormationStatsByCountry(),
        getFormationStatsByManager(),
        getFormationTotalCount(),
        getFormationProspectStats()
      ]);
      
      setStatsByCountry(byCountry);
      setStatsByManager(byManager);
      setTotalCount(total);
      setProspectStats(prospectStats);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des statistiques:", err);
    }
  }, []);

  const fetchProspectStatsByCountryHandler = useCallback(async (country: string): Promise<FormationProspectStats[]> => {
    try {
      return await getFormationProspectStatsByCountry(country);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des statistiques par pays:", err);
      return [];
    }
  }, []);

  return {
    formations,
    isLoading,
    error,
    refetch,
    create: createFormationHandler,
    update: updateFormationHandler,
    remove: deleteFormationHandler,
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

// Hook spécialisé pour les formations par pays
export function useFormationsByCountry(country: string) {
  return useFormations({ initialFilter: { country } });
}