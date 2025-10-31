/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/prospect-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Mail, MapPin, Building, User } from "lucide-react";
import { PROSPECT_STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Prospect } from "@/types/prospect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RowActions } from "./row-actions";

interface ProspectCardProps {
  prospect: Prospect;
  onDelete?: () => void; // Callback pour rafraîchir la liste après suppression
}

export function ProspectCard({ prospect, onDelete }: ProspectCardProps) {
  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NOUVEAU':
        return 'bg-blue-100 text-blue-800';
      case 'QUALIFIE':
        return 'bg-green-100 text-green-800';
      case 'CONVERTI':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAS_SERIEUX':
        return 'bg-gray-100 text-gray-800';
      case 'PERDU':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le nom à afficher
  const getDisplayName = () => {
    if (prospect.type === 'ENTREPRISE' && prospect.companyName) {
      return prospect.companyName;
    }
    return `${prospect.firstName || ''} ${prospect.lastName || ''}`.trim() || 'Sans nom';
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (prospect.type === 'ENTREPRISE' && prospect.companyName) {
      return prospect.companyName.substring(0, 2).toUpperCase();
    }
    const firstName = prospect.firstName || '';
    const lastName = prospect.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-x-4 p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {getDisplayName()}
            </h4>
            <p className="text-xs text-gray-500 truncate">{prospect.email}</p>
          </div>
        </div>
        <RowActions prospect={prospect} onDelete={onDelete} />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getStatusBadgeColor(prospect.status)}>
            {PROSPECT_STATUS_LABEL[prospect.status]}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            {prospect.type === 'ENTREPRISE' ? (
              <Building className="h-3 w-3 mr-1" />
            ) : (
              <User className="h-3 w-3 mr-1" />
            )}
            {prospect.type === 'ENTREPRISE' ? 'Entreprise' : 'Particulier'}
          </div>
        </div>
        
        <div className="space-y-2">
          {prospect.phone && (
            <div className="flex items-center text-xs text-gray-500">
              <Phone className="h-3 w-3 mr-1" />
              {prospect.phone}
            </div>
          )}
          
          {prospect.country && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {prospect.country}
            </div>
          )}
          
          {prospect.assignedTo && (
            <div className="flex items-center text-xs text-gray-500">
              <Avatar className="h-4 w-4 mr-1">
                <AvatarFallback className="text-xs">
                  {prospect.assignedTo.firstName?.charAt(0)}{prospect.assignedTo.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              Assigné à: {prospect.assignedTo.firstName} {prospect.assignedTo.lastName}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProspectCardSkeleton() {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-x-4 p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="h-10 w-10 bg-gray-200" />
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </CardContent>
    </Card>
  );
}