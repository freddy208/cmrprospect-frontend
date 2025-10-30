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
import { MoreHorizontal, Phone, Mail, MapPin, User } from "lucide-react";
import { PROSPECT_STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RowActions } from "./row-actions";
import type { Prospect } from "@/types/prospect";

interface ProspectTableProps {
  prospects: Prospect[];
  isLoading: boolean;
}

export function ProspectTable({ prospects, isLoading }: ProspectTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Assigné à</TableHead>
              <TableHead>Créé par</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">Loading...</TableCell>
                <TableCell className="h-4 w-20 bg-gray-200"></TableCell>
                <TableCell className="h-4 w-32 bg-gray-200"></TableCell>
                <TableCell className="h-4 w-20 bg-gray-200"></TableCell>
                <TableCell className="h-4 w-24 bg-gray-200"></TableCell>
                <TableCell className="h-4 w-24 bg-gray-200"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              <TableHead>Statut</TableHead>
              <TableHead>Assigné à</TableHead>
              <TableHead>Créé par</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => (
            <TableRow key={prospect.id}>
              <TableCell className="font-medium">{prospect.firstName} {prospect.lastName}</TableCell>
              <TableCell className="text-muted-foreground">{prospect.email}</TableCell>
              <TableCell>
                <Badge variant={prospect.status === 'CONVERTI' ? 'default' : 'secondary'}>
                  {PROSPECT_STATUS_LABEL[prospect.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {prospect.assignedTo ? `${prospect.assignedTo.firstName} ${prospect.assignedTo.lastName}` : "Non assigné"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {prospect.createdBy.firstName} {prospect.createdBy.lastName}
              </TableCell>
              <TableCell className="text-right">
                <RowActions prospect={prospect} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}