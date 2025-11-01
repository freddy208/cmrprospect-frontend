/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Users, UserCheck, UserX, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/users/UserTable";
import { UserDetailsDialog } from "@/components/users/UserDetailsDialog";
import { UserEditDialog } from "@/components/users/UserEditDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { UserFilters } from "@/components/users/UserFilters";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useUsers } from "@/hooks/useUsers";
import { getCurrentUser } from "@/lib/api";
import { User, UserFilter } from "@/types/user";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    deleted: 0
  });

  const {
    users,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    getById,
    resetPassword,
    toggleStatus
  } = useUsers({ initialFilter: filters, autoFetch: true });

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
  }, []);

  useEffect(() => {
    // Calculer les statistiques
    if (users.length > 0) {
      const stats = users.reduce((acc, user) => {
        acc.total++;
        if (user.status === "ACTIVE") acc.active++;
        else if (user.status === "INACTIVE") acc.inactive++;
        else if (user.status === "DELETED") acc.deleted++;
        return acc;
      }, { total: 0, active: 0, inactive: 0, deleted: 0 });
      setUserStats(stats);
    }
  }, [users]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilter = (newFilters: UserFilter) => {
    setFilters(newFilters);
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsEditOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleResetPassword = async (user: User) => {
    try {
      await resetPassword(user.id);
      toast.success("Un email de réinitialisation du mot de passe a été envoyé à l'utilisateur");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe");
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleStatus(user.id);
      toast.success(`L'utilisateur a été ${user.isActive ? "désactivé" : "activé"} avec succès`);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur lors du changement de statut");
    }
  };

  const handleCreateUser = async (data: any) => {
    try {
      await create(data);
      setIsEditOpen(false);
      toast.success("Utilisateur créé avec succès !");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la création de l'utilisateur.");
    }
  };

  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return;
    try {
      await update(selectedUser.id, data);
      setIsEditOpen(false);
      toast.success("Utilisateur mis à jour avec succès !");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur.");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const success = await remove(selectedUser.id);
      if (success) {
        setIsDeleteOpen(false);
        toast.success("Utilisateur supprimé avec succès !");
        refetch();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur.");
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
            Utilisateurs
          </h1>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2"
            style={{ backgroundColor: "#1D4ED8" }}
          >
            <Plus className="h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total des utilisateurs</p>
                  <p className="text-2xl font-bold" style={{ color: "#171717" }}>{userStats.total}</p>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <Users className="h-6 w-6" style={{ color: "#1D4ED8" }} />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
                </div>
                <div className="p-2 rounded-full bg-green-100">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs inactifs</p>
                  <p className="text-2xl font-bold text-gray-600">{userStats.inactive}</p>
                </div>
                <div className="p-2 rounded-full bg-gray-100">
                  <UserX className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs supprimés</p>
                  <p className="text-2xl font-bold text-red-600">{userStats.deleted}</p>
                </div>
                <div className="p-2 rounded-full bg-red-100">
                  <Activity className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Filtres */}
        <UserFilters
          filters={filters}
          onFilter={handleFilter}
          currentUser={currentUser}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Liste des utilisateurs */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Erreur: {error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucun utilisateur trouvé.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <UserTable
              users={users}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Dialogues */}
      <UserDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={selectedUser}
      />

      <UserEditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        currentUser={currentUser}
      />

      <DeleteUserDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteUser}
        userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""}
      />

      {/* Bouton pour remonter en haut */}
      <ScrollToTop />
    </div>
  );
}