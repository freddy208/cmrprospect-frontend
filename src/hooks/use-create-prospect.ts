/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-create-prospect.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query"; // <-- Bonne pratique d'importer useQueryClient
import { toast } from "sonner";
// --- CORRECTION 1 : Importer le type manquant ---
import { CreateProspectData } from "@/types/prospect";
import { createProspect as createProspectApi } from "@/lib/api"; // <-- Bonne pratique : séparer l'appel API

export function useCreateProspect() {
  const queryClient = useQueryClient();

  const createProspectMutation = useMutation({
    // --- CORRECTION 2 : Utiliser la fonction API importée ---
    mutationFn: (data: CreateProspectData) => createProspectApi(data),
    onSuccess: () => {
      toast.success("Prospect créé avec succès !");
      // Invalider le cache pour que la liste des prospects se mette à jour
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue.");
    },
  });

  // --- CORRECTION 3 : Retourner la fonction mutateAsync, pas son résultat ---
  return {
    mutateAsync: createProspectMutation.mutateAsync,
    isPending: createProspectMutation.isPending, // Exposer aussi l'état de chargement
  };
}