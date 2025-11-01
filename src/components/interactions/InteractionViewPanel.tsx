/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/interactions/components/InteractionViewPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProspect } from "@/lib/api";
import { useInteractionsForProspect } from "@/hooks/useInteractions";
import { InteractionItem } from "./InteractionItem";
import { InteractionEditDialog } from "./InteractionEditDialog";
import { cn } from "@/lib/utils";
import { Prospect } from "@/types/prospect";

interface InteractionViewPanelProps {
  prospectId: string;
  onBack: () => void;
}

export function InteractionViewPanel({ prospectId, onBack }: InteractionViewPanelProps) {
  const { interactions, isLoading, error, create, update, remove } = useInteractionsForProspect(prospectId);
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<any>(null);

  useEffect(() => {
    const fetchProspectDetails = async () => {
      try {
        const data = await getProspect(prospectId);
        setProspect(data);
      } catch (err) {
        console.error("Failed to fetch prospect details:", err);
      }
    };
    fetchProspectDetails();
  }, [prospectId]);

  const handleCreateNew = () => {
    setEditingInteraction(null); // Mode création
    setIsEditDialogOpen(true);
  };

  const handleEdit = (interaction: any) => {
    setEditingInteraction(interaction); // Mode édition
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
    <motion.div 
      layoutId={`prospect-${prospectId}`}
      className="p-4 border-b border-gray-200 bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "#171717" }}>
              {prospect 
                ? prospect.type === "ENTREPRISE"
                  ? prospect.companyName
                  : `${prospect.firstName} ${prospect.lastName}`
                : "Chargement..."
              }
            </h2>
            <p className="text-sm text-gray-500">{prospect?.email}</p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouvelle interaction
        </Button>
      </div>
    </motion.div>


      {/* Liste des interactions */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && <p>Chargement des interactions...</p>}
        {error && <p style={{ color: "red" }}>Erreur: {error}</p>}
        {!isLoading && !error && interactions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p>Aucune interaction pour ce prospect.</p>
            <p>Cliquez sur &quot;Nouvelle interaction&quot; pour commencer.</p>
          </div>
        )}
        <AnimatePresence>
          {interactions.map((interaction) => (
            <InteractionItem
              key={interaction.id}
              interaction={interaction}
              onEdit={handleEdit}
              onDelete={remove}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de création/édition */}
      <InteractionEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        prospectId={prospectId}
        interaction={editingInteraction}
        onSubmit={async (data) => {
            if (editingInteraction) {
            await update(editingInteraction.id, data as any);
            } else {
            await create(data as any);
            }
        }}
        />

    </div>
  );
}