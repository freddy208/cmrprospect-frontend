// src/components/simulateurs/SimulateurCard.tsx
"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, MapPin, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Simulateur } from "@/types/simulateur";
import { SIMULATEUR_STATUS_LABEL } from "@/lib/constants";

interface SimulateurCardProps {
  simulateur: Simulateur;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SimulateurCard({ simulateur, onViewDetails, onEdit, onDelete }: SimulateurCardProps) {
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className="h-2" style={{ backgroundColor: "#FBBF24" }}></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold truncate" style={{ color: "#171717" }}>
              {simulateur.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewDetails}>
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3 mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {simulateur.description}
            </p>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{simulateur.country}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>{simulateur.monthlyPrice.toLocaleString()} FCFA/mois</span>
            </div>

            {simulateur._count && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{simulateur._count.prospects} prospect(s)</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(simulateur.status)}>
              {SIMULATEUR_STATUS_LABEL[simulateur.status]}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              style={{ borderColor: "#1D4ED8", color: "#1D4ED8" }}
            >
              Voir détails
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}