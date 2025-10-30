/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useDashboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getDashboardStats } from "@/lib/api";

// Importe les types directement depuis leur fichier de définition
import type { DashboardStats, DashboardFilter } from "@/types/dashboard";

type UseDashboardReturn = {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: (filter?: DashboardFilter) => Promise<void>;
};

export function useDashboard(initialFilter?: DashboardFilter): UseDashboardReturn {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- CORRECTION CRUCIALE ---
  // On ajoute le type de retour explicite à la fonction async
  const fetchStats = useCallback(async (filter?: DashboardFilter): Promise<void> => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return; // return implicite de void, c'est ok
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getDashboardStats(filter);
      setStats(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des stats du dashboard:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats(initialFilter);
  }, [fetchStats, initialFilter]);

// src/hooks/useDashboard.ts

// ... (le début du fichier est identique)

// Fonction de rechargement manuel
// --- CORRECTION CRUCIALE ---
const refetch = useCallback(async (filter?: DashboardFilter): Promise<void> => {
  await fetchStats(filter);
}, [fetchStats]);

return { stats, isLoading, error, refetch };
} 