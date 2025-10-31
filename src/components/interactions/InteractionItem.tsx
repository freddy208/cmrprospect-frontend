// src/app/(dashboard)/interactions/components/InteractionItem.tsx
"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InteractionDetailsDialog } from "./InteractionDetailsDialog";
import { DeleteInteractionDialog } from "./DeleteInteractionDialog";
import { type Interaction } from "@/types/interaction";
import { LEAD_CHANNEL_LABEL } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

interface InteractionItemProps {
  interaction: Interaction;
  onEdit: (interaction: Interaction) => void;
  onDelete: (id: string) => Promise<boolean>;
}

export function InteractionItem({ interaction, onEdit, onDelete }: InteractionItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">via {LEAD_CHANNEL_LABEL[interaction.channel || 'AUTRE'] || interaction.channel}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{interaction.notes}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {interaction.user.firstName} {interaction.user.lastName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(interaction.createdAt), { addSuffix: true, locale: fr })}
                  </div>
                  {interaction.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {interaction.duration} min
                    </div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir le menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
                    Voir les détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(interaction)}>
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <InteractionDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        interaction={interaction}
      />
      <DeleteInteractionDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => onDelete(interaction.id)}
      />
    </>
  );
}