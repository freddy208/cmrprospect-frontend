"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InteractionForm } from "./InteractionForm";
import { type Interaction, type CreateInteractionData, type UpdateInteractionData } from "@/types/interaction";
import { LEAD_CHANNEL } from "@/lib/constants";

interface InteractionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
  interaction?: Interaction | null; // null pour la création
  onSubmit: (data: CreateInteractionData | UpdateInteractionData) => Promise<void>;
}

// Fonction pour transformer un Interaction en valeurs par défaut valides pour le formulaire
const transformInteractionToFormValues = (interaction?: Interaction | null) => {
  if (!interaction) return {};
  
  return {
    channel: interaction.channel || Object.values(LEAD_CHANNEL)[0], // Utiliser une valeur par défaut si channel est null
    notes: interaction.notes || "",
    duration: interaction.duration || 0,
  };
};

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

  // Transformer les valeurs par défaut si elles viennent d'un objet Interaction
  const formDefaultValues = transformInteractionToFormValues(interaction);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{interaction ? "Modifier l'interaction" : "Ajouter une interaction"}</DialogTitle>
        </DialogHeader>
        <InteractionForm
          prospectId={prospectId}
          defaultValues={formDefaultValues}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}