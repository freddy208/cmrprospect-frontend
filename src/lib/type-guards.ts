/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/type-guards.ts

import type { DashboardStats, DashboardStatsDG, DashboardStatsCM, DashboardStatsSO } from "@/types/dashboard";
import type { AuthUser } from "@/types/auth";

/**
 * Garde de type pour vérifier si les stats sont celles d'un Directeur Général.
 */
export function isDGStats(stats: DashboardStats): stats is DashboardStatsDG {
  return 'activeUsers' in stats;
}

/**
 * Garde de type pour vérifier si les stats sont celles d'un Country Manager.
 */
export function isCMStats(stats: DashboardStats): stats is DashboardStatsCM {
  return !isDGStats(stats) && 'topSalesOfficers' in stats;
}

/**
 * Garde de type pour vérifier si les stats sont celles d'un Sales Officer.
 */
export function isSOStats(stats: DashboardStats): stats is DashboardStatsSO {
  return !isDGStats(stats) && !isCMStats(stats);
}