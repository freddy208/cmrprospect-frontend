/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useProspects.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {  type Prospect, type ProspectFilter } from "@/types/prospect";
import { getProspects} from "@/lib/api"

type UseProspectsReturn = {
  prospects: Prospect[];
  isLoading: boolean;
  error: string | null;
  refetch: (filter?: ProspectFilter) => Promise<void>;
};

export function useProspects(initialFilter?: ProspectFilter): UseProspectsReturn {
  const { user } = useAuth();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProspects = useCallback(async (filter?: ProspectFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProspects(filter);
      setProspects(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des prospects:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setProspects([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProspects(initialFilter);
  }, [fetchProspects, initialFilter]);

 // --- CORRECTION CRUCIALE ---
  // La fonction `refetch` doit être `async` et `await` l'appel à `fetchProspects`
  const refetch = useCallback(async (filter?: ProspectFilter): Promise<void> => {
    await fetchProspects(filter);
  }, [fetchProspects]);

  return { prospects, isLoading, error, refetch };
}