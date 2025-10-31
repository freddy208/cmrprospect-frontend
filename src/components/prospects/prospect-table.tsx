/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/prospect-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Mail, MapPin, User, Building } from "lucide-react";
import { PROSPECT_STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RowActions } from "./row-actions";
import type { Prospect } from "@/types/prospect";
import { Skeleton } from "@/components/ui/skeleton";

interface ProspectTableProps {
  prospects: Prospect[];
  isLoading: boolean;
  onDelete?: () => void; // Callback pour rafraîchir la liste après suppression
}

export function ProspectTable({ prospects, isLoading, onDelete }: ProspectTableProps) {
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
  const getDisplayName = (prospect: Prospect) => {
    if (prospect.type === 'ENTREPRISE' && prospect.companyName) {
      return prospect.companyName;
    }
    return `${prospect.firstName || ''} ${prospect.lastName || ''}`.trim() || 'Sans nom';
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = (prospect: Prospect) => {
    if (prospect.type === 'ENTREPRISE' && prospect.companyName) {
      return prospect.companyName.substring(0, 2).toUpperCase();
    }
    const firstName = prospect.firstName || '';
    const lastName = prospect.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigné à</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!prospects || prospects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#F3F4F6" }}>
          <span className="text-2xl" style={{ color: "#1D4ED8" }}>📋</span>
        </div>
        <h3 className="text-lg font-medium mb-1" style={{ color: "#171717" }}>Aucun prospect trouvé</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Essayez d&apos;ajuster vos filtres ou de créer un nouveau prospect pour commencer.
        </p>
        <button 
          className="mt-4 px-4 py-2 rounded-md text-white text-sm font-medium"
          style={{ backgroundColor: "#1D4ED8" }}
          onClick={() => window.location.href = "/prospects/create"}
        >
          Créer un prospect
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Assigné à</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => (
            <TableRow key={prospect.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
                      {getInitials(prospect)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{getDisplayName(prospect)}</div>
                    {prospect.type === 'ENTREPRISE' && prospect.contactFirstName && (
                      <div className="text-xs text-gray-500">
                        Contact: {prospect.contactFirstName} {prospect.contactLastName}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{prospect.email}</TableCell>
              <TableCell className="text-muted-foreground">{prospect.phone}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(prospect.status)}>
                  {PROSPECT_STATUS_LABEL[prospect.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {prospect.type === 'ENTREPRISE' ? (
                    <Building className="h-4 w-4 mr-1 text-gray-500" />
                  ) : (
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  {prospect.type === 'ENTREPRISE' ? 'Entreprise' : 'Particulier'}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {prospect.assignedTo ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {prospect.assignedTo.firstName?.charAt(0)}{prospect.assignedTo.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{prospect.assignedTo.firstName} {prospect.assignedTo.lastName}</span>
                  </div>
                ) : (
                  "Non assigné"
                )}
              </TableCell>
              <TableCell className="text-right">
                <RowActions prospect={prospect} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}