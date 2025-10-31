/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-delete-prospect.ts
"use client";

import { useState } from "react";
import { deleteProspect } from "@/lib/api";

export function useDeleteProspect() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProspectById = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteProspect(id);
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la suppression du prospect:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProspect: deleteProspectById,
    isDeleting,
  };
}