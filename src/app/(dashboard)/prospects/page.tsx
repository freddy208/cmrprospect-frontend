/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/prospects/page.tsx
"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
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

function ProspectsPageContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- CORRECTION : Logique généralisée pour déterminer le filtre et l'onglet actif ---
  let initialFilter = {};
  let activeTab = "PARTICULIER"; // Onglet par défaut

  // On vérifie d'abord les URL "propres"
  switch (pathname) {
    case "/prospects/particuliers":
      initialFilter = { type: "PARTICULIER" };
      activeTab = "PARTICULIER";
      break;
    case "/prospects/entreprises":
      initialFilter = { type: "ENTREPRISE" };
      activeTab = "ENTREPRISE";
      break;
    case "/prospects/aboutis":
      initialFilter = { status: "CONVERTI" };
      activeTab = "CONVERTI";
      break;
    default:
      // Cas par défaut : on utilise le paramètre ?type=... s'il existe
      const typeFromUrl = (searchParams.get("type") as keyof typeof PROSPECT_TYPE) || "PARTICULIER";
      initialFilter = { type: typeFromUrl };
      activeTab = typeFromUrl;
      break;
  }

  const [currentView, setCurrentView] = useState<"grid" | "table">("grid");
  const { user } = useAuth();

  const { prospects, isLoading, error, refetch } = useProspects(initialFilter);

  const handleCreateSuccess = () => {
    toast.success("Prospect créé avec succès !");
    refetch();
  };

  if (error) {
    return <div>Erreur lors du chargement des prospects : {error}</div>;
  }

  // --- ASTUCE : On extrait le contenu commun pour éviter la répétition ---
  const prospectContent = (
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
          <ProspectGrid prospects={prospects} isLoading={isLoading} />
        ) : (
          <ProspectTable prospects={prospects} isLoading={isLoading} />
        )}
      </div>
    </div>
  );

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
        <Button onClick={() => window.location.href = `/prospects/create?type=${activeTab === "CONVERTI" ? "PARTICULIER" : activeTab}`}>
          <Plus className="mr-2 h-4 w-4" /> Créer un Prospect
        </Button>
      </div>

      {/* Tabs for Prospect Type */}
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="PARTICULIER">Particuliers</TabsTrigger>
          <TabsTrigger value="ENTREPRISE">Entreprises</TabsTrigger>
          <TabsTrigger value="CONVERTI">Aboutis</TabsTrigger>
        </TabsList>

        {/* On réutilise le même contenu pour tous les onglets */}
        <TabsContent value="PARTICULIER" className="mt-6">
          {prospectContent}
        </TabsContent>
        <TabsContent value="ENTREPRISE" className="mt-6">
          {prospectContent}
        </TabsContent>
        <TabsContent value="CONVERTI" className="mt-6">
          {prospectContent}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default function ProspectsPage() {
  return (
    <Suspense fallback={<div>Chargement de la page...</div>}>
      <ProspectsPageContent />
    </Suspense>
  );
}