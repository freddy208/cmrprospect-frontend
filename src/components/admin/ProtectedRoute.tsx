// src/components/admin/ProtectedRoute.tsx
"use client";

import { usePermissionsCheck } from "@/hooks/usePermissionsCheck";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Composant qui protège une route en fonction des permissions de l'utilisateur
 * @param children Contenu à afficher si l'utilisateur a les permissions requises
 * @param permission Permission unique requise
 * @param permissions Liste de permissions requises
 * @param requireAll Si true, l'utilisateur doit avoir toutes les permissions, sinon une seule suffit
 * @param fallback Contenu à afficher si l'utilisateur n'a pas les permissions requises
 */
export function ProtectedRoute({ 
  children, 
  permission, 
  permissions, 
  requireAll = false, 
  fallback = null 
}: ProtectedRouteProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissionsCheck();
  
  let hasRequiredPermission = false;
  
  if (permission) {
    hasRequiredPermission = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasRequiredPermission = requireAll 
      ? hasAllPermissions(permissions) 
      : hasAnyPermission(permissions);
  } else {
    // Si aucune permission n'est spécifiée, on autorise l'accès
    hasRequiredPermission = true;
  }
  
  return hasRequiredPermission ? <>{children}</> : <>{fallback}</>;
}