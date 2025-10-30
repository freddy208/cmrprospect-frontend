/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-update-prospect.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProspect } from "@/lib/api"; // <-- Utiliser la fonction API centralisée
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UpdateProspectData } from "@/types/prospect"; // <-- CORRECTION : Importer le type

// Le hook ne doit s'occuper que de la mutation
export function useMutateUpdateProspect(prospectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    // La fonction de mutation prend les données et appelle l'API
    mutationFn: (data: UpdateProspectData) => updateProspect(prospectId, data),
    onSuccess: () => {
      toast.success("Prospect mis à jour avec succès !");
      // Invalider le cache pour mettre à jour les données affichées
      queryClient.invalidateQueries({ queryKey: ["prospect", prospectId] });
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      router.push(`/prospects/${prospectId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue lors de la mise à jour.");
    },
  });
}