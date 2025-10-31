/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useRoles.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { 
  getRoles, 
  getRole, 
  createRole, 
  updateRole, 
  deleteRole
} from "@/lib/api";
import { 
  Role, 
  RoleFilter, 
  CreateRoleData, 
  UpdateRoleData
} from "@/types/role";

type UseRolesOptions = {
  initialFilter?: RoleFilter;
  autoFetch?: boolean;
};

type UseRolesReturn = {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  refetch: (newFilter?: RoleFilter) => Promise<void>;
  create: (data: CreateRoleData) => Promise<Role | null>;
  update: (id: string, data: UpdateRoleData) => Promise<Role | null>;
  remove: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<Role | null>;
};

export function useRoles({ initialFilter, autoFetch = true }: UseRolesOptions = {}): UseRolesReturn {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RoleFilter>(initialFilter || {});

  const fetchRoles = useCallback(async (currentFilter: RoleFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRoles(currentFilter);
      setRoles(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des rôles:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (autoFetch) {
      fetchRoles(filter);
    }
  }, [fetchRoles, filter, autoFetch]);

  const refetch = useCallback(async (newFilter?: RoleFilter) => {
    const finalFilter = newFilter || filter;
    setFilter(finalFilter);
    await fetchRoles(finalFilter);
  }, [fetchRoles, filter]);

  const createRoleHandler = useCallback(async (data: CreateRoleData): Promise<Role | null> => {
    if (!user) return null;
    try {
      const newRole = await createRole(data);
      setRoles(prev => [newRole, ...prev]);
      return newRole;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
      return null;
    }
  }, [user]);

  const updateRoleHandler = useCallback(async (id: string, data: UpdateRoleData): Promise<Role | null> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return null;
    }
    
    try {
      const updatedRole = await updateRole(id, data);
      setRoles(prev => prev.map(r => r.id === id ? updatedRole : r));
      return updatedRole;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour.");
      return null;
    }
  }, [user]);

  const deleteRoleHandler = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteRole(id);
      setRoles(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
      return false;
    }
  }, []);

  const getByIdHandler = useCallback(async (id: string): Promise<Role | null> => {
    try {
      return await getRole(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la récupération du rôle.");
      return null;
    }
  }, []);

  return {
    roles,
    isLoading,
    error,
    refetch,
    create: createRoleHandler,
    update: updateRoleHandler,
    remove: deleteRoleHandler,
    getById: getByIdHandler
  };
}