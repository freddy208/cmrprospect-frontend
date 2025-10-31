/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-update-prospect.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProspect } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UpdateProspectData } from "@/types/prospect";

export function useMutateUpdateProspect(prospectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProspectData) => updateProspect(prospectId, data),
    onSuccess: () => {
      toast.success("Prospect mis à jour avec succès !");
      queryClient.invalidateQueries({ queryKey: ["prospect", prospectId] });
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      router.push(`/prospects/${prospectId}`);
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du prospect:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue lors de la mise à jour du prospect.");
      }
    },
  });
}