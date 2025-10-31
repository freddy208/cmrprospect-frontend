// src/app/(dashboard)/interactions/components/InteractionDetailsDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MessageSquare } from "lucide-react";
import { type Interaction } from "@/types/interaction";
import { LEAD_CHANNEL_LABEL } from "@/lib/constants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface InteractionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  interaction: Interaction;
}

export function InteractionDetailsDialog({ isOpen, onClose, interaction }: InteractionDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de l&apos;interaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
              {LEAD_CHANNEL_LABEL[interaction.channel || 'AUTRE'] || interaction.channel}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Par {interaction.user.firstName} {interaction.user.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Le {format(new Date(interaction.createdAt), 'Pp', { locale: fr })}</span>
          </div>
          {interaction.duration && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Durée : {interaction.duration} minutes</span>
            </div>
          )}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes
            </h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{interaction.notes}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}