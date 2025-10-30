/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/prospects/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProspects } from "@/hooks/useProspects";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { ProspectGrid } from "@/components/prospects/prospect-grid";
import { ProspectTable } from "@/components/prospects/prospect-table";
import { ViewToggle } from "@/components/prospects/view-toggle";
import { ProspectFilters } from "@/components/prospects/prospect-filters";
import { PROSPECT_TYPE } from "@/lib/constants";

export default function ProspectsPage() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as keyof typeof PROSPECT_TYPE) || "PARTICULIER";
  const [currentView, setCurrentView] = useState<"grid" | "table">("grid");
  const { user } = useAuth();

  // --- CORRECTION 1 : Récupérez toutes les données du hook ---
  const { prospects, isLoading, error, refetch } = useProspects({ type: initialType });

  const handleCreateSuccess = () => {
    toast.success("Prospect créé avec succès !");
    refetch();
  };

  // --- CORRECTION 2 (Optionnel mais recommandé) : Gérez l'état d'erreur ici ---
  if (error) {
    return <div>Erreur lors du chargement des prospects : {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
          <p className="text-muted-foreground">Gérez vos prospects et suivez leur progression.</p>
        </div>
        <Button onClick={() => window.location.href = `/prospects/create?type=${initialType}`}>
          <Plus className="mr-2 h-4 w-4" /> Créer un Prospect
        </Button>
      </div>

      {/* Tabs for Prospect Type */}
      <Tabs defaultValue={initialType} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="PARTICULIER">Particuliers</TabsTrigger>
          <TabsTrigger value="ENTREPRISE">Entreprises</TabsTrigger>
          <TabsTrigger value="CONVERTI">Aboutis</TabsTrigger>
        </TabsList>
        <TabsContent value={initialType} className="mt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-64">
              <ProspectFilters onFilterChange={function (filters: any): void {
                              throw new Error("Function not implemented.");
                          } } />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <ViewToggle view={currentView} onViewChange={setCurrentView} />
              </div>
              {currentView === "grid" ? (
                // --- CORRECTION 3 : Passez les bonnes props ---
                <ProspectGrid prospects={prospects} isLoading={isLoading} />
              ) : (
                // --- CORRECTION 4 : Faites de même pour ProspectTable ---
                <ProspectTable prospects={prospects} isLoading={isLoading} />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}