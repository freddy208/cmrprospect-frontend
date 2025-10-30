// src/components/prospects/interaction-list.tsx
"use client";

import { getInteractionsForProspect } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";

interface InteractionListProps {
  prospectId: string;
}

export function InteractionList({ prospectId }: InteractionListProps) {
  const { data: interactions, isLoading, error } = useQuery({
    queryKey: ["interactions", prospectId],
    queryFn: () => getInteractionsForProspect(prospectId),
  });

  if (isLoading) return <div>Chargement des interactions...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="flex space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {interaction.user.firstName?.charAt(0)}
              {interaction.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{interaction.user.firstName} {interaction.user.lastName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(interaction.createdAt), { addSuffix: true, locale: fr })}
              </p>
            </div>
            <p className="text-sm text-gray-700">{interaction.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}