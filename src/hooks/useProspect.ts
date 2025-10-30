/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useProspect.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { type Prospect, type UpdateProspectData } from "@/types/prospect";
import { getProspect, updateProspect } from '@/lib/api'

type UseProspectReturn = {
  prospect: Prospect | null;
  isLoading: boolean;
  error: string | null;
  update: (data: UpdateProspectData) => Promise<void>;
  refetch: () => Promise<void>;
};

export function useProspect(id: string): UseProspectReturn {
  const { user } = useAuth();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProspect = useCallback(async () => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProspect(id);
      setProspect(data);
    } catch (err: any) {
      console.error(`Erreur lors de la récupération du prospect ${id}:`, err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setProspect(null);
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchProspect();
  }, [fetchProspect]);

  const updateProspectData = useCallback(async (data: UpdateProspectData) => {
    if (!prospect) return;
    setIsLoading(true);
    setError(null);

    try {
      const updatedProspect = await updateProspect(prospect.id, data);
      setProspect(updatedProspect);
    } catch (err: any) {
      console.error(`Erreur lors de la mise à jour du prospect ${id}:`, err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }, [prospect]);

  return { prospect, isLoading, error, update: updateProspectData, refetch: fetchProspect };
}