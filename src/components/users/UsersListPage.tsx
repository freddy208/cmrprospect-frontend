/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUsers, useDeleteUser } from "@/hooks/useUser";
import { IUser, IUserFilter } from "@/types/user";
import RoleKpiCards from "@/components/users/RoleKpiCards";
import UserFilters from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import UsersGrid from "@/components/users/UsersGrid";
import { Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/confirm-dialog"; // ✅ voir point 2

// ✅ --- Déplacé en dehors de UsersListPage ---
const EmptyState = ({ filters }: { filters: IUserFilter }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 px-4"
  >
    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <UsersIcon className="w-10 h-10 text-blue-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">
      Aucun utilisateur trouvé
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {filters.search || filters.role || filters.country || filters.status
        ? "Aucun utilisateur ne correspond à vos critères de recherche."
        : "Commencez par créer votre premier utilisateur."}
    </p>
    <Button
      onClick={() => (window.location.href = "/users/create")}
      className="bg-blue-600 hover:bg-blue-700"
    >
      Créer un utilisateur
    </Button>
  </motion.div>
);

// ✅ --- Ton composant principal ---
export default function UsersListPage() {
  const [viewMode] = useState<"table" | "grid">("table");
  const [filters, setFilters] = useState<IUserFilter>({});
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const { data: users = [], isLoading, isError } = useUsers(filters);
  const deleteUserMutation = useDeleteUser();

  // ... tes fonctions confirmDelete, handleDeleteUser, handleExportCSV restent identiques ...

  const handleDeleteUser = (user: IUser) => {
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success("Utilisateur supprimé", {
          description: `${userToDelete.firstName} ${userToDelete.lastName} a été supprimé avec succès.`,
        });
        setUserToDelete(null);
      },
      onError: (error: any) => {
        toast.error("Erreur de suppression", {
          description:
            error?.response?.data?.message ||
            "Impossible de supprimer cet utilisateur.",
        });
        setUserToDelete(null);
      },
    });
  };

  const handleExportCSV = () => {
    // Générer CSV simple
    const headers = ["Email", "Prénom", "Nom", "Rôle", "Pays", "Statut", "Date création"];
    const rows = users.map((user) => [
      user.email,
      user.firstName || "",
      user.lastName || "",
      user.role,
      user.country || "",
      user.isActive && user.status === "ACTIVE" ? "Actif" : "Inactif",
      new Date(user.createdAt).toLocaleDateString("fr-FR"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `utilisateurs-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export réussi", {
      description: "Le fichier CSV a été téléchargé.",
    });
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">
            Impossible de charger la liste des utilisateurs.
          </p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header, filtres, KPIs inchangés */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleKpiCards users={users} isLoading={isLoading} />
        <UserFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExportCSV={handleExportCSV}
        />

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white border border-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState filters={filters} /> 
        ) : viewMode === "table" ? (
          <UsersTable users={users} onDelete={handleDeleteUser} />
        ) : (
          <UsersGrid users={users} onDelete={handleDeleteUser} />
        )}
      </div>

      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={(open: any) => !open && setUserToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer cet utilisateur ?"
        description={`Vous êtes sur le point de supprimer ${userToDelete?.firstName} ${userToDelete?.lastName}. Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  );
}
