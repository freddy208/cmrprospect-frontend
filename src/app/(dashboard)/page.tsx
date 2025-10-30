/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/page.tsx
"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Users, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { isDGStats, isCMStats, isSOStats } from "@/lib/type-guards";

// Composant pour afficher une carte de statistique
function StatCard({ title, value, icon: Icon, trend, className }: { title: string; value: string | number; icon: any; trend?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {trend !== undefined && (
            <p className={cn("text-xs text-muted-foreground flex items-center", trend > 0 ? "text-green-600" : "text-red-600")}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.abs(trend)}% par rapport au mois dernier
            </p>
          )}
        </CardContent>
        <div className="absolute h-1 w-full bg-linear-to-r from-yellow-400 to-blue-600 bottom-0 left-0"></div>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-20" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-96">
          <CardHeader className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

 return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Voici un aperçu de vos performances.</p>
      </div>

      {/* Grid des cartes de statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Prospects" value={stats.totalProspects} icon={Users} />
        <StatCard title="Conversions" value={stats.totalConversions} icon={UserCheck} />
        <StatCard title="Taux de Conversion" value={`${stats.conversionRate}%`} icon={TrendingUp} />
        {/* Afficher une carte supplémentaire UNIQUEMENT pour le DG */}
        {isDGStats(stats) && <StatCard title="Utilisateurs Actifs" value={stats.activeUsers} icon={Users} />}
      </div>

      {/* Autres sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prospects par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{JSON.stringify(stats.prospectsByStatus, null, 2)}</pre>
          </CardContent>
        </Card>

        {/* Afficher la carte "Top Sales Officers" UNIQUEMENT pour DG et CM */}
        {(isDGStats(stats) || isCMStats(stats)) && (
          <Card>
            <CardHeader>
              <CardTitle>Top Sales Officers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {stats.topSalesOfficers.map((officer) => (
                  <li key={officer.id} className="flex justify-between">
                    <span>{officer.firstName} {officer.lastName}</span>
                    <span className="font-semibold">{officer.prospectCount}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Afficher la carte "Top Country Managers" UNIQUEMENT pour le DG */}
        {isDGStats(stats) && (
          <Card>
            <CardHeader>
              <CardTitle>Top Country Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {stats.topCountryManagers.map((manager) => (
                  <li key={manager.id} className="flex justify-between">
                    <span>{manager.firstName} {manager.lastName} ({manager.country})</span>
                    <span className="font-semibold">{manager.prospectCount}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
