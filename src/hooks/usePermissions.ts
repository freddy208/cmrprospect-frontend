/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/usePermissions.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getPermissions } from "@/lib/api";
import { Permission, PermissionFilter } from "@/types/permission";

type UsePermissionsOptions = {
  initialFilter?: PermissionFilter;
  autoFetch?: boolean;
};

type UsePermissionsReturn = {
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;
  refetch: (newFilter?: PermissionFilter) => Promise<void>;
};

export function usePermissions({ initialFilter, autoFetch = true }: UsePermissionsOptions = {}): UsePermissionsReturn {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PermissionFilter>(initialFilter || {});

  const fetchPermissions = useCallback(async (currentFilter: PermissionFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPermissions(currentFilter);
      setPermissions(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des permissions:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (autoFetch) {
      fetchPermissions(filter);
    }
  }, [fetchPermissions, filter, autoFetch]);

  const refetch = useCallback(async (newFilter?: PermissionFilter) => {
    const finalFilter = newFilter || filter;
    setFilter(finalFilter);
    await fetchPermissions(finalFilter);
  }, [fetchPermissions, filter]);

  return {
    permissions,
    isLoading,
    error,
    refetch
  };
}