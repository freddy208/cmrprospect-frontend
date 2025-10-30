/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/interaction-section.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { addInteractionToProspect, getInteractionsForProspect } from "@/lib/api";
import { toast } from "sonner";
import { InteractionList } from "./interaction-list";
import { Separator } from "@radix-ui/react-select";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface InteractionSectionProps {
  prospectId: string;
}

export function InteractionSection({ prospectId }: InteractionSectionProps) {
  const { user } = useAuth();
  const [newInteraction, setNewInteraction] = useState({ notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInteraction.notes.trim()) return;

    setIsSubmitting(true);
    try {
      await addInteractionToProspect(prospectId, { notes: newInteraction.notes });
      setNewInteraction({ notes: "" });
      toast.success("Interaction ajoutée !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'interaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Historique des Interactions</h3>
      <Separator />
      
      {/* Interaction List */}
      <InteractionList prospectId={prospectId} />

      {/* Add Interaction Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Ajouter une note d'interaction..."
            value={newInteraction.notes}
            onChange={(e: { target: { value: any; }; }) => setNewInteraction({ notes: e.target.value })}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isSubmitting}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}