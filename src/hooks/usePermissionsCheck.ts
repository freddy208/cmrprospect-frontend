// src/hooks/usePermissionsCheck.ts
"use client";

import { useAuth } from "./useAuth";
import { PERMISSIONS } from "@/lib/constants";

/**
 * Hook pour vérifier si l'utilisateur actuel a une permission spécifique
 * @returns Objet avec des méthodes pour vérifier les permissions
 */
export function usePermissionsCheck() {
  const { user } = useAuth();
  
  // Vérifie si l'utilisateur a une permission spécifique
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    
    return user.role.permissions.some(p => p.name === permission);
  };
  
  // Vérifie si l'utilisateur a au moins une des permissions spécifiées
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    
    return permissions.some(permission => 
      user.role.permissions.some(p => p.name === permission)
    );
  };
  
  // Vérifie si l'utilisateur a toutes les permissions spécifiées
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    
    return permissions.every(permission => 
      user.role.permissions.some((p: { name: string; }) => p.name === permission)
    );
  };
  
  // Vérifie si l'utilisateur est un administrateur (a toutes les permissions)
  const isAdmin = (): boolean => {
    if (!user || !user.role) {
      return false;
    }
    
    return user.role.name === "DIRECTEUR_GENERAL";
  };
  
  // Vérifie si l'utilisateur peut gérer les prospects
  const canManageProspects = (): boolean => {
    return hasAnyPermission([
      PERMISSIONS.PROSPECTS_READ,
      PERMISSIONS.PROSPECTS_CREATE,
      PERMISSIONS.PROSPECTS_UPDATE,
      PERMISSIONS.PROSPECTS_DELETE
    ]);
  };
  
  // Vérifie si l'utilisateur peut gérer les rôles
  const canManageRoles = (): boolean => {
    return hasAnyPermission([
      PERMISSIONS.ROLES_READ,
      PERMISSIONS.ROLES_CREATE,
      PERMISSIONS.ROLES_UPDATE,
      PERMISSIONS.ROLES_DELETE
    ]);
  };
  
  // Vérifie si l'utilisateur peut gérer les utilisateurs
  const canManageUsers = (): boolean => {
    return hasAnyPermission([
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.USERS_DELETE
    ]);
  };
  
  // Vérifie si l'utilisateur peut gérer les formations
  const canManageFormations = (): boolean => {
    return hasAnyPermission([
      PERMISSIONS.FORMATIONS_READ,
      PERMISSIONS.FORMATIONS_CREATE,
      PERMISSIONS.FORMATIONS_UPDATE,
      PERMISSIONS.FORMATIONS_DELETE
    ]);
  };
  
  // Vérifie si l'utilisateur peut gérer les simulateurs
  const canManageSimulateurs = (): boolean => {
    return hasAnyPermission([
      PERMISSIONS.SIMULATEURS_READ,
      PERMISSIONS.SIMULATEURS_CREATE,
      PERMISSIONS.SIMULATEURS_UPDATE,
      PERMISSIONS.SIMULATEURS_DELETE
    ]);
  };
  
  // Vérifie si l'utilisateur peut accéder au tableau de bord
  const canAccessDashboard = (): boolean => {
    return hasPermission(PERMISSIONS.DASHBOARD_READ);
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    canManageProspects,
    canManageRoles,
    canManageUsers,
    canManageFormations,
    canManageSimulateurs,
    canAccessDashboard
  };
}