/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/prospect-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { PROSPECT_STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Prospect } from "@/types/prospect";

interface ProspectCardProps {
  prospect: Prospect;
}

export function ProspectCard({ prospect }: ProspectCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-x-4 p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {prospect.assignedTo ? (
                `${prospect.assignedTo.firstName?.charAt(0)}${prospect.assignedTo.lastName?.charAt(0)}`
              ) : (
                `${prospect.firstName?.charAt(0)}${prospect.lastName?.charAt(0)}`
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-semibold text-gray-900">
              {prospect.firstName} {prospect.lastName}
            </h4>
            <p className="text-xs text-gray-500">{prospect.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant={prospect.status === 'CONVERTI' ? 'default' : 'secondary'}>
            {PROSPECT_STATUS_LABEL[prospect.status]}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {prospect.companyName || `${prospect.firstName} ${prospect.lastName}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// src/components/prospects/prospect-card.tsx

// ... (le reste du fichier est inchangé)

export function ProspectCardSkeleton() {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-x-4 p-4">
        <div className="flex items-center space-x-2">
          {/* --- CORRECTION : Envelopper AvatarFallback dans Avatar --- */}
          <Avatar className="h-10 w-10">
            <AvatarFallback className="h-10 w-10 bg-gray-200" /> {/* Ajout d'une couleur de fond pour le skeleton */}
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
      </CardContent>
    </Card>
  );
}
