/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-create-prospect.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateProspectData } from "@/types/prospect";
import { createProspect as createProspectApi } from "@/lib/api";

export function useCreateProspect() {
  const queryClient = useQueryClient();

  const createProspectMutation = useMutation({
    mutationFn: (data: CreateProspectData) => createProspectApi(data),
    onSuccess: () => {
      toast.success("Prospect créé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la création du prospect:", error);
      
      // Afficher un message d'erreur plus détaillé si disponible
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue lors de la création du prospect.");
      }
    },
  });

  return {
    mutateAsync: createProspectMutation.mutateAsync,
    isPending: createProspectMutation.isPending,
  };
}