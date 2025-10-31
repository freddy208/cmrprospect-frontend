/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/interaction-section.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, Send, Phone, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { addInteractionToProspect, getInteractionsForProspect } from "@/lib/api";
import { toast } from "sonner";
import { InteractionList } from "./interaction-list";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

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
      // Forcer un rafraîchissement des interactions
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'interaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
            <MessageSquarePlus className="h-5 w-5" style={{ color: "#1D4ED8" }} />
            Historique des Interactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interaction List */}
          <InteractionList prospectId={prospectId} />

          <Separator />

          {/* Add Interaction Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Ajouter une note d'interaction..."
                  value={newInteraction.notes}
                  onChange={(e) => setNewInteraction({ notes: e.target.value })}
                  className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newInteraction.notes.trim()}
                    style={{ backgroundColor: "#1D4ED8" }}
                    className="text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}