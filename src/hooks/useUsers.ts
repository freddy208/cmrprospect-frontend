/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useUsers.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  toggleUserStatus,
  getUserStats
} from "@/lib/api";
import {
  User,
  UserFilter,
  CreateUserData,
  UpdateUserData
} from "@/types/user";

type UseUsersOptions = {
  initialFilter?: UserFilter;
  autoFetch?: boolean;
};

type UseUsersReturn = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: (newFilter?: UserFilter) => Promise<void>;
  create: (data: CreateUserData) => Promise<User | null>;
  update: (id: string, data: UpdateUserData) => Promise<User | null>;
  remove: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<User | null>;
  resetPassword: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<User | null>;
  getStats: (id: string) => Promise<any>;
  getRecentUsers: (limit?: number) => Promise<User[]>;
};

export function useUsers({ initialFilter, autoFetch = true }: UseUsersOptions = {}): UseUsersReturn {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<UserFilter>(initialFilter || {});

  const fetchUsers = useCallback(async (currentFilter: UserFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers(currentFilter);
      setUsers(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (autoFetch) {
      fetchUsers(filter);
    }
  }, [fetchUsers, filter, autoFetch]);

  const refetch = useCallback(async (newFilter?: UserFilter) => {
    const finalFilter = newFilter || filter;
    setFilter(finalFilter);
    await fetchUsers(finalFilter);
  }, [fetchUsers, filter]);

  const createUserHandler = useCallback(async (data: CreateUserData): Promise<User | null> => {
    if (!user) return null;
    try {
      const newUser = await createUser(data);
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
      return null;
    }
  }, [user]);

  const updateUserHandler = useCallback(async (id: string, data: UpdateUserData): Promise<User | null> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return null;
    }

    try {
      const updatedUser = await updateUser(id, data);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      return updatedUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour.");
      return null;
    }
  }, [user]);

  const deleteUserHandler = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
      return false;
    }
  }, []);

  const getByIdHandler = useCallback(async (id: string): Promise<User | null> => {
    try {
      return await getUser(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la récupération de l'utilisateur.");
      return null;
    }
  }, []);

  const resetPasswordHandler = useCallback(async (id: string): Promise<boolean> => {
    try {
      await resetUserPassword(id);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.");
      return false;
    }
  }, []);

  const toggleStatusHandler = useCallback(async (id: string): Promise<User | null> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return null;
    }

    try {
      const updatedUser = await toggleUserStatus(id);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      return updatedUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors du changement de statut.");
      return null;
    }
  }, [user]);

  const getStatsHandler = useCallback(async (id: string): Promise<any> => {
    try {
      return await getUserStats(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la récupération des statistiques.");
      return null;
    }
  }, []);

  // Nouvelle méthode pour récupérer les utilisateurs récents selon leur dernière connexion
  const getRecentUsersHandler = useCallback(async (limit = 5): Promise<User[]> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return [];
    }
    
    try {
      // Créer un filtre pour trier par dernière connexion
      const recentFilter: UserFilter = {
        sortBy: "lastLogin",
        sortOrder: "desc",
        limit
      };
      
      return await getUsers(recentFilter);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des utilisateurs récents:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      return [];
    }
  }, [user]);

  return {
    users,
    isLoading,
    error,
    refetch,
    create: createUserHandler,
    update: updateUserHandler,
    remove: deleteUserHandler,
    getById: getByIdHandler,
    resetPassword: resetPasswordHandler,
    toggleStatus: toggleStatusHandler,
    getStats: getStatsHandler,
    getRecentUsers: getRecentUsersHandler
  };
}