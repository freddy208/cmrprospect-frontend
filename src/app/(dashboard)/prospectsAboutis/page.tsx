/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/prospects/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProspectsAboutis } from "@/hooks/useProspectsAboutis";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ProspectGrid } from "@/components/prospects/prospect-grid";
import { ProspectTable } from "@/components/prospects/prospect-table";
import { ViewToggle } from "@/components/prospects/view-toggle";
import { ProspectFilters } from "@/components/prospects/prospect-filters";
import { PROSPECT_STATUS_LABEL, PROSPECT_TYPE_LABEL } from "@/lib/constants";

function ProspectsPageContent() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  // Utiliser un état local pour éviter les boucles infinies
  const [prospectFilter, setProspectFilter] = useState({});
  
  // Ne charger les données que lorsque les filtres changent réellement
  const { prospects, isLoading, error, refetch } = useProspectsAboutis(prospectFilter);

  // Mettre à jour les filtres de manière contrôlée
  useEffect(() => {
    const combinedFilters = {
      ...filters,
      ...(searchTerm && { search: searchTerm })
    };
    
    // Vérifier si les filtres ont réellement changé avant de mettre à jour
    if (JSON.stringify(combinedFilters) !== JSON.stringify(prospectFilter)) {
      setProspectFilter(combinedFilters);
    }
  }, [filters, searchTerm, prospectFilter]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateSuccess = () => {
    toast.success("Prospect créé avec succès !");
    refetch();
  };

  // Fonction wrapper pour gérer le clic sur le bouton Réessayer
  const handleRetryClick = () => {
    refetch();
  };

  // Fonction pour rafraîchir la liste après suppression
  const handleDeleteSuccess = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
            <CardDescription>
              Une erreur est survenue lors du chargement des prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{error}</p>
            <Button onClick={handleRetryClick} className="mt-4 w-full">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Compter les filtres actifs (en excluant les valeurs undefined)
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      style={{ backgroundColor: "#F9FAFB", minHeight: "100vh", padding: "1.5rem" }}
    >
      {/* Header avec style premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#171717" }}>
            Prospects
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez tous vos prospects particuliers et suivez leur progression
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            style={{ borderColor: "#1D4ED8", color: "#1D4ED8" }}
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button 
            onClick={() => window.location.href = "/prospects/create"}
            style={{ backgroundColor: "#1D4ED8" }}
            className="text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> 
            Créer un Prospect
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                <p className="text-2xl font-bold" style={{ color: "#1D4ED8" }}>
                  {prospects?.length || 0}
                </p>
              </div>
              <div className="p-2 rounded-full" style={{ backgroundColor: "#F9FAFB" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1D4ED8" }}>
                  <span className="text-white text-sm font-bold">P</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                <p className="text-2xl font-bold" style={{ color: "#1D4ED8" }}>
                  {prospects?.filter(p => p.status === 'NOUVEAU').length || 0}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualifiés</p>
                <p className="text-2xl font-bold" style={{ color: "#1D4ED8" }}>
                  {prospects?.filter(p => p.status === 'QUALIFIE').length || 0}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Qualifié</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Convertis</p>
                <p className="text-2xl font-bold" style={{ color: "#1D4ED8" }}>
                  {prospects?.filter(p => p.status === 'CONVERTI').length || 0}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800" style={{ backgroundColor: "#FBBF24", color: "#171717" }}>
                Converti
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, entreprise..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
                style={{ borderColor: "#E5E7EB" }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
              style={{ borderColor: "#1D4ED8", color: "#1D4ED8" }}
            >
              <Filter className="h-4 w-4" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <ViewToggle view={currentView} onViewChange={setCurrentView} />
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <ProspectFilters onFilterChange={handleFilterChange} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          {currentView === "grid" ? (
            <ProspectGrid prospects={prospects} isLoading={isLoading} onDelete={handleDeleteSuccess} />
          ) : (
            <ProspectTable prospects={prospects} isLoading={isLoading} onDelete={handleDeleteSuccess} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProspectsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#F9FAFB" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement des prospects...</p>
        </div>
      </div>
    }>
      <ProspectsPageContent />
    </Suspense>
  );
}