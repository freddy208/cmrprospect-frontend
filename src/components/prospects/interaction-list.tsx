// src/components/prospects/interaction-list.tsx
"use client";

import { getInteractions } from "@/lib/api"; // Modification ici
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { Phone, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { Interaction } from "@/types/index";

interface InteractionListProps {
  prospectId: string;
}

export function InteractionList({ prospectId }: InteractionListProps) {
  const { data: interactions, isLoading, error } = useQuery<Interaction[]>({
    queryKey: ["interactions", prospectId],
    queryFn: () => getInteractions({ prospectId }), // Modification ici
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-800">Erreur: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!interactions || interactions.length === 0) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#F3F4F6" }}>
            <Phone className="h-8 w-8" style={{ color: "#1D4ED8" }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: "#171717" }}>Aucune interaction</h3>
          <p className="text-gray-600">
            Ce prospect n&apos;a pas encore d&apos;interactions enregistrées.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction, index) => (
        <motion.div
          key={interaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
                    {interaction.user.firstName?.charAt(0)}
                    {interaction.user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium" style={{ color: "#171717" }}>
                      {interaction.user.firstName} {interaction.user.lastName}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(interaction.createdAt), { addSuffix: true, locale: fr })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {interaction.notes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}