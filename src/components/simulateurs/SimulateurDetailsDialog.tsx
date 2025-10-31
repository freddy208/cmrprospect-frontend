// src/components/simulateurs/SimulateurDetailsDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Calendar, User, Users } from "lucide-react";
import { Simulateur } from "@/types/simulateur";
import { SIMULATEUR_STATUS_LABEL } from "@/lib/constants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SimulateurDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  simulateur: Simulateur | null;
}

export function SimulateurDetailsDialog({ isOpen, onClose, simulateur }: SimulateurDetailsDialogProps) {
  if (!simulateur) return null;

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
          <DialogTitle>Détails du simulateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "#171717" }}>
              {simulateur.name}
            </h3>
            <Badge className={getStatusColor(simulateur.status)}>
              {SIMULATEUR_STATUS_LABEL[simulateur.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-sm">{simulateur.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <span className="text-sm">{simulateur.monthlyPrice.toLocaleString()} FCFA/mois</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                Créé le {format(new Date(simulateur.createdAt), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            {simulateur.updatedAt !== simulateur.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm">
                  Modifié le {format(new Date(simulateur.updatedAt), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2" style={{ color: "#171717" }}>Description</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {simulateur.description}
            </p>
          </div>

          {simulateur.createdBy && (
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                Créé par {simulateur.createdBy.firstName} {simulateur.createdBy.lastName}
              </span>
            </div>
          )}

          {simulateur._count && (
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                {simulateur._count.prospects} prospect(s) inscrit(s)
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}