/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useInteractions.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getInteractions, createInteraction, updateInteraction, deleteInteraction } from "@/lib/api";
import { 
  Interaction, 
  InteractionFilter, 
  CreateInteractionData, 
  UpdateInteractionData 
} from "@/types/interaction";

type UseInteractionsOptions = {
  initialFilter?: InteractionFilter;
  autoFetch?: boolean;
};

type UseInteractionsReturn = {
  interactions: Interaction[];
  isLoading: boolean;
  error: string | null;
  refetch: (newFilter?: InteractionFilter) => Promise<void>;
  create: (data: CreateInteractionData) => Promise<Interaction | null>;
  update: (id: string, data: UpdateInteractionData) => Promise<Interaction | null>;
  remove: (id: string) => Promise<boolean>;
};

export function useInteractions({ initialFilter, autoFetch = true }: UseInteractionsOptions = {}): UseInteractionsReturn {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<InteractionFilter>(initialFilter || {});

  const fetchInteractions = useCallback(async (currentFilter: InteractionFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInteractions(currentFilter);
      // S'assurer que chaque interaction a un utilisateur
      const interactionsWithUser = data.map(interaction => ({
        ...interaction,
        user: interaction.user || {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      }));
      setInteractions(interactionsWithUser);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des interactions:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setInteractions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (autoFetch) {
      fetchInteractions(filter);
    }
  }, [fetchInteractions, filter, autoFetch]);

  const refetch = useCallback(async (newFilter?: InteractionFilter) => {
    const finalFilter = newFilter || filter;
    setFilter(finalFilter);
    await fetchInteractions(finalFilter);
  }, [fetchInteractions, filter]);

  const createInteractionHandler = useCallback(async (data: CreateInteractionData): Promise<Interaction | null> => {
    if (!user) return null;
    try {
      const newInteraction = await createInteraction(data);
      // S'assurer que la nouvelle interaction a un utilisateur
      const interactionWithUser = {
        ...newInteraction,
        user: newInteraction.user || {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      };
      setInteractions(prev => [interactionWithUser, ...prev]);
      return interactionWithUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
      return null;
    }
  }, [user]);

  const updateInteractionHandler = useCallback(async (id: string, data: UpdateInteractionData): Promise<Interaction | null> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return null;
    }
    
    try {
      const updatedInteraction = await updateInteraction(id, data);
      // S'assurer que l'interaction mise à jour a un utilisateur
      const interactionWithUser = {
        ...updatedInteraction,
        user: updatedInteraction.user || {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      };
      setInteractions(prev => prev.map(i => i.id === id ? interactionWithUser : i));
      return interactionWithUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour.");
      return null;
    }
  }, [user]);

  const deleteInteractionHandler = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteInteraction(id);
      setInteractions(prev => prev.filter(i => i.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
      return false;
    }
  }, []);

  return {
    interactions,
    isLoading,
    error,
    refetch,
    create: createInteractionHandler,
    update: updateInteractionHandler,
    remove: deleteInteractionHandler,
  };
}

export function useInteractionsForProspect(prospectId: string) {
  return useInteractions({ initialFilter: { prospectId } });
}