/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/formations/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormationCard } from "@/components/formations/FormationCard";
import { FormationDetailsDialog } from "@/components/formations/FormationDetailsDialog";
import { FormationEditDialog } from "@/components/formations/FormationEditDialog";
import { DeleteFormationDialog } from "@/components/formations/DeleteFormationDialog";
import { FormationStatsCards } from "@/components/formations/FormationStatsCards";
import { FormationFilters } from "@/components/formations/FormationFilters";
import { useFormations } from "@/hooks/useFormations";
import { getCurrentUser } from "@/lib/api";
import { Formation, FormationFilter } from "@/types/formation";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FormationFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const {
    formations,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    stats,
    fetchStats
  } = useFormations({ autoFetch: true });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      }
    };
    fetchUser();
    fetchStats();
  }, [fetchStats]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const handleFilter = (newFilters: FormationFilter) => {
    setFilters(newFilters);
  };

  const handleCreateNew = () => {
    setSelectedFormation(null);
    setIsEditOpen(true);
  };

  const handleViewDetails = (formation: Formation) => {
    setSelectedFormation(formation);
    setIsDetailsOpen(true);
  };

  const handleEdit = (formation: Formation) => {
    setSelectedFormation(formation);
    setIsEditOpen(true);
  };

  const handleDelete = (formation: Formation) => {
    setSelectedFormation(formation);
    setIsDeleteOpen(true);
  };

  const handleCreateFormation = async (data: any) => {
    try {
      await create(data);
      setIsEditOpen(false);
      toast.success("Formation créée avec succès !");
      refetch();
      fetchStats();
    } catch (error) {
      toast.error("Erreur lors de la création de la formation.");
    }
  };

  const handleUpdateFormation = async (data: any) => {
    if (!selectedFormation) return;
    try {
      await update(selectedFormation.id, data);
      setIsEditOpen(false);
      toast.success("Formation mise à jour avec succès !");
      refetch();
      fetchStats();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la formation.");
    }
  };

  const handleDeleteFormation = async () => {
    if (!selectedFormation) return;
    try {
      const success = await remove(selectedFormation.id);
      if (success) {
        setIsDeleteOpen(false);
        toast.success("Formation supprimée avec succès !");
        refetch();
        fetchStats();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la formation.");
    }
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
            Formations
          </h1>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2"
            style={{ backgroundColor: "#1D4ED8" }}
          >
            <Plus className="h-4 w-4" />
            Nouvelle formation
          </Button>
        </div>

        {/* Cartes de statistiques */}
        <FormationStatsCards stats={stats} isLoading={isLoading} />

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        {/* Filtres */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormationFilters
              filters={filters}
              onFilter={handleFilter}
              currentUser={currentUser}
            />
          </motion.div>
        )}

        {/* Liste des formations */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Erreur: {error}</p>
          </div>
        ) : formations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune formation trouvée.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {formations.map((formation) => (
              <FormationCard
                key={formation.id}
                formation={formation}
                onViewDetails={() => handleViewDetails(formation)}
                onEdit={() => handleEdit(formation)}
                onDelete={() => handleDelete(formation)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Dialogues */}
      <FormationDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formation={selectedFormation}
      />

      <FormationEditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        formation={selectedFormation}
        onSubmit={selectedFormation ? handleUpdateFormation : handleCreateFormation}
        currentUser={currentUser}
      />

      <DeleteFormationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteFormation}
        formationName={selectedFormation?.name || ""}
      />
    </div>
  );
}