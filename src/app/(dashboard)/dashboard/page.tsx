/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(dashboard)/page.tsx
"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Users, UserCheck, Globe, Award, BarChart3, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isDGStats, isCMStats, isSOStats } from "@/lib/type-guards";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PROSPECT_STATUS_LABEL, ROLE_LABEL } from "@/lib/constants";

// Composant pour afficher une carte de statistique
function StatCard({ title, value, icon: Icon, trend, description, className }: { 
  title: string; 
  value: string | number; 
  icon: any; 
  trend?: number; 
  description?: string;
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn("relative overflow-hidden shadow-sm", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: "#6B7280" }}>{title}</CardTitle>
          <div className="p-2 rounded-full" style={{ backgroundColor: "#EBF5FF" }}>
            <Icon className="h-4 w-4" style={{ color: "#1D4ED8" }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#171717" }}>{value}</div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {trend !== undefined && (
            <p className={cn("text-xs flex items-center mt-2", trend > 0 ? "text-green-600" : "text-red-600")}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend > 0 ? "+" : ""}{trend}% par rapport au mois dernier
            </p>
          )}
        </CardContent>
        <div className="absolute h-1 w-full bottom-0 left-0" style={{ background: "linear-gradient(to right, #FBBF24, #1D4ED8)" }}></div>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh", padding: "1.5rem" }}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#F9FAFB" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FEE2E2" }}>
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#171717" }}>Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error || "Impossible de charger les données du tableau de bord"}</p>
        </motion.div>
      </div>
    );
  }

  // Convertir les données de prospects par statut en tableau
// Convertir les données de prospects par statut en tableau
const prospectsByStatusArray = Object.entries(stats.prospectsByStatus || {}).map(([status, count]) => {
  // Gérer les deux formats possibles: nombre ou objet avec _count
  let countValue = 0;
  if (typeof count === 'number') {
    countValue = count;
  } else if (count && typeof count === 'object' && '_count' in count) {
    countValue = count._count.id || 0;
  }
  
  return {
    status,
    count: countValue
  };
});

  // Calculer le total pour les pourcentages
  const totalProspectsByStatus = prospectsByStatusArray.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh", padding: "1.5rem" }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#171717" }}>Tableau de bord</h1>
        <p className="text-gray-600">Voici un aperçu de vos performances.</p>
      </div>

      {/* Grid des cartes de statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Prospects" 
          value={stats.totalProspects} 
          icon={Users} 
          description="Nombre total de prospects"
        />
        <StatCard 
          title="Conversions" 
          value={stats.totalConversions} 
          icon={UserCheck} 
          description="Prospects convertis en clients"
        />
        <StatCard 
          title="Taux de Conversion" 
          value={`${stats.conversionRate}%`} 
          icon={TrendingUp} 
          description="Pourcentage de conversion"
        />
        {/* Afficher une carte supplémentaire UNIQUEMENT pour le DG */}
        {isDGStats(stats) && (
          <StatCard 
            title="Utilisateurs Actifs" 
            value={stats.activeUsers} 
            icon={Users} 
            description="Utilisateurs actifs cette semaine"
          />
        )}
      </div>

      {/* Autres sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Graphique des prospects par statut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <PieChart className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Prospects par statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prospectsByStatusArray.map((item, index) => {
                    const percentage = totalProspectsByStatus > 0 
                      ? Math.round((item.count / totalProspectsByStatus) * 100) 
                      : 0;
                    
                    // Définir la couleur selon le statut
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'NOUVEAU': return '#3B82F6'; // blue-500
                        case 'QUALIFIE': return '#10B981'; // emerald-500
                        case 'CONVERTI': return '#F59E0B'; // amber-500
                        case 'PAS_SERIEUX': return '#6B7280'; // gray-500
                        case 'PERDU': return '#EF4444'; // red-500
                        default: return '#6B7280'; // gray-500
                      }
                    };
                    
                    // Ajout d'une description pour chaque statut
                    const getStatusDescription = (status: string) => {
                      switch (status) {
                        case 'NOUVEAU': return 'Prospects récemment ajoutés';
                        case 'QUALIFIE': return 'Prospects qualifiés et prêts pour la conversion';
                        case 'CONVERTI': return 'Prospects devenus clients';
                        case 'PAS_SERIEUX': return 'Prospects non intéressés ou non réactifs';
                        case 'PERDU': return 'Prospects perdus durant le processus';
                        default: return '';
                      }
                    };
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getStatusColor(item.status) }}
                            ></div>
                            <span className="text-sm font-medium">{PROSPECT_STATUS_LABEL[item.status]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.count}</span>
                            <span className="text-xs text-gray-500">({percentage}%)</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 ml-5">{getStatusDescription(item.status)}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: getStatusColor(item.status)
                            }}
                          ></div>
                        </div>
                        {/* Ajout d'un bouton pour voir les détails *
                        <div className="flex justify-end">
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={() => {
                              // Implémenter la navigation vers la liste des prospects avec ce statut
                              console.log(`Voir les prospects avec le statut: ${item.status}`);
                            }}
                          >
                            Voir les détails
                          </button>
                        </div> */}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
        </motion.div>

        {/* Afficher la carte "Top Sales Officers" UNIQUEMENT pour DG et CM */}
        {(isDGStats(stats) || isCMStats(stats)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <Award className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Top Sales Officers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topSalesOfficers.map((officer, index) => (
                    <div key={officer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
                              {officer.firstName?.charAt(0) || ''}{officer.lastName?.charAt(0) || ''}
                            </AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FBBF24" }}>
                              <span className="text-xs font-bold" style={{ color: "#171717" }}>1</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: "#171717" }}>
                            {officer.firstName || ''} {officer.lastName || ''}
                          </p>
                          <p className="text-xs text-gray-500">
                            {officer.role ? ROLE_LABEL[officer.role] || officer.role : 'Non spécifié'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: "#1D4ED8" }}>{officer.prospectCount}</p>
                        <p className="text-xs text-gray-500">prospects</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Afficher la carte "Top Country Managers" UNIQUEMENT pour le DG */}
        {isDGStats(stats) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <Globe className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Top Country Managers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topCountryManagers?.map((manager, index) => (
                    <div key={manager.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
                              {manager.firstName?.charAt(0) || ''}{manager.lastName?.charAt(0) || ''}
                            </AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FBBF24" }}>
                              <span className="text-xs font-bold" style={{ color: "#171717" }}>1</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: "#171717" }}>
                            {manager.firstName || ''} {manager.lastName || ''}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {manager.countryName || 'Non spécifié'}
                            </Badge>
                            <p className="text-xs text-gray-500">Country Manager</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: "#1D4ED8" }}>{manager.prospectCount}</p>
                        <p className="text-xs text-gray-500">prospects</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}