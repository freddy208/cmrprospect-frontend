// src/components/formations/FormationDetailsDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Calendar, User, Users } from "lucide-react";
import { Formation } from "@/types/formation";
import { FORMATION_STATUS_LABEL } from "@/lib/constants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface FormationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formation: Formation | null;
}

export function FormationDetailsDialog({ isOpen, onClose, formation }: FormationDetailsDialogProps) {
  if (!formation) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la formation</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "#171717" }}>
              {formation.name}
            </h3>
            <Badge className={getStatusColor(formation.status)}>
              {FORMATION_STATUS_LABEL[formation.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-sm">{formation.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <span className="text-sm">{formation.price.toLocaleString()} FCFA</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                Créée le {format(new Date(formation.createdAt), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            {formation.updatedAt !== formation.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm">
                  Modifiée le {format(new Date(formation.updatedAt), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2" style={{ color: "#171717" }}>Description</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {formation.description}
            </p>
          </div>

          {formation.createdBy && (
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                Créée par {formation.createdBy.firstName} {formation.createdBy.lastName}
              </span>
            </div>
          )}

          {formation._count && (
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                {formation._count.prospects} prospect(s) inscrit(s)
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}