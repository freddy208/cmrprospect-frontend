/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/simulateurs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimulateurCard } from "@/components/simulateurs/SimulateurCard";
import { SimulateurDetailsDialog } from "@/components/simulateurs/SimulateurDetailsDialog";
import { SimulateurEditDialog } from "@/components/simulateurs/SimulateurEditDialog";
import { DeleteSimulateurDialog } from "@/components/simulateurs/DeleteSimulateurDialog";
import { SimulateurStatsCards } from "@/components/simulateurs/SimulateurStatsCards";
import { SimulateurFilters } from "@/components/simulateurs/SimulateurFilters";
import { useSimulateurs } from "@/hooks/useSimulateurs";
import { getCurrentUser } from "@/lib/api";
import { Simulateur, SimulateurFilter } from "@/types/simulateur";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimulateursPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SimulateurFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSimulateur, setSelectedSimulateur] = useState<Simulateur | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Par
const {
  simulateurs,
  isLoading,
  error,
  refetch,
  create,
  update,
  remove,
  stats,
  fetchStats
} = useSimulateurs({ initialFilter: filters, autoFetch: true });

// Ajouter un useEffect pour recharger les données lorsque les filtres changent
useEffect(() => {
  refetch(filters);
}, [filters, refetch]);
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
  setFilters(prev => ({ ...prev, search: value }));
};

  const handleFilter = (newFilters: SimulateurFilter) => {
    setFilters(newFilters);
  };

  const handleCreateNew = () => {
    setSelectedSimulateur(null);
    setIsEditOpen(true);
  };

  const handleViewDetails = (simulateur: Simulateur) => {
    setSelectedSimulateur(simulateur);
    setIsDetailsOpen(true);
  };

  const handleEdit = (simulateur: Simulateur) => {
    setSelectedSimulateur(simulateur);
    setIsEditOpen(true);
  };

  const handleDelete = (simulateur: Simulateur) => {
    setSelectedSimulateur(simulateur);
    setIsDeleteOpen(true);
  };

  const handleCreateSimulateur = async (data: any) => {
    try {
      await create(data);
      setIsEditOpen(false);
      toast.success("Simulateur créé avec succès !");
      refetch();
      fetchStats();
    } catch (error) {
      toast.error("Erreur lors de la création du simulateur.");
    }
  };

  const handleUpdateSimulateur = async (data: any) => {
    if (!selectedSimulateur) return;
    try {
      await update(selectedSimulateur.id, data);
      setIsEditOpen(false);
      toast.success("Simulateur mis à jour avec succès !");
      refetch();
      fetchStats();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du simulateur.");
    }
  };

  const handleDeleteSimulateur = async () => {
    if (!selectedSimulateur) return;
    try {
      const success = await remove(selectedSimulateur.id);
      if (success) {
        setIsDeleteOpen(false);
        toast.success("Simulateur supprimé avec succès !");
        refetch();
        fetchStats();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du simulateur.");
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
            Simulateurs
          </h1>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2"
            style={{ backgroundColor: "#1D4ED8" }}
          >
            <Plus className="h-4 w-4" />
            Nouveau simulateur
          </Button>
        </div>

        {/* Cartes de statistiques */}
        <SimulateurStatsCards stats={stats} isLoading={isLoading} />

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un simulateur..."
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
            <SimulateurFilters
              filters={filters}
              onFilter={handleFilter}
              currentUser={currentUser}
            />
          </motion.div>
        )}

        {/* Liste des simulateurs */}
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
        ) : simulateurs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun simulateur trouvé.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {simulateurs.map((simulateur) => (
              <SimulateurCard
                key={simulateur.id}
                simulateur={simulateur}
                onViewDetails={() => handleViewDetails(simulateur)}
                onEdit={() => handleEdit(simulateur)}
                onDelete={() => handleDelete(simulateur)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Dialogues */}
      <SimulateurDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        simulateur={selectedSimulateur}
      />

      <SimulateurEditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        simulateur={selectedSimulateur}
        onSubmit={selectedSimulateur ? handleUpdateSimulateur : handleCreateSimulateur}
        currentUser={currentUser}
      />

      <DeleteSimulateurDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteSimulateur}
        simulateurName={selectedSimulateur?.name || ""}
      />
    </div>
  );
}