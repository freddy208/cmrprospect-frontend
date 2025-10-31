// src/app/(dashboard)/interactions/components/InteractionEditDialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InteractionForm } from "./InteractionForm";
import { type Interaction, type CreateInteractionData, type UpdateInteractionData } from "@/types/interaction";

interface InteractionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
  interaction?: Interaction | null; // null pour la création
  onSubmit: (data: CreateInteractionData | UpdateInteractionData) => Promise<void>;
}

export function InteractionEditDialog({ isOpen, onClose, prospectId, interaction, onSubmit }: InteractionEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: CreateInteractionData | UpdateInteractionData) => {
    setIsLoading(true);
    try {
      await onSubmit({ ...data, prospectId });
      onClose();
    } catch (error) {
      console.error("Failed to submit interaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{interaction ? "Modifier l'interaction" : "Ajouter une interaction"}</DialogTitle>
        </DialogHeader>
        <InteractionForm
          defaultValues={interaction || { prospectId }}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}