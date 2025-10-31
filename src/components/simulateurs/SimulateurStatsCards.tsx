// src/components/simulateurs/SimulateurStatsCards.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Users, TrendingUp, Globe } from "lucide-react";
import { SimulateurStatsByCountry, SimulateurStatsByManager, SimulateurProspectStats } from "@/types/simulateur";
import { Skeleton } from "../ui/skeleton";

interface SimulateurStatsCardsProps {
  stats: {
    byCountry: SimulateurStatsByCountry[];
    byManager: SimulateurStatsByManager[];
    totalCount: number;
    prospectStats: SimulateurProspectStats[];
  };
  isLoading: boolean;
}

export function SimulateurStatsCards({ stats, isLoading }: SimulateurStatsCardsProps) {
  const totalProspects = stats.prospectStats.reduce((sum, stat) => sum + stat.totalProspects, 0);
  const averageProspectsPerSimulateur = stats.prospectStats.length > 0 
    ? Math.round(totalProspects / stats.prospectStats.length) 
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <Skeleton className="h-10 w-10 rounded-md mb-4" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-0" style={{ backgroundColor: "#F9FAFB" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total simulateurs</p>
                <p className="text-3xl font-bold mt-2" style={{ color: "#171717" }}>
                  {stats.totalCount}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "#FEF3C7" }}>
                <Monitor className="h-6 w-6" style={{ color: "#FBBF24" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-0" style={{ backgroundColor: "#F9FAFB" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total prospects</p>
                <p className="text-3xl font-bold mt-2" style={{ color: "#171717" }}>
                  {totalProspects}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "#EBF5FF" }}>
                <Users className="h-6 w-6" style={{ color: "#1D4ED8" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-0" style={{ backgroundColor: "#F9FAFB" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moyenne par simulateur</p>
                <p className="text-3xl font-bold mt-2" style={{ color: "#171717" }}>
                  {averageProspectsPerSimulateur}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "#EBF5FF" }}>
                <TrendingUp className="h-6 w-6" style={{ color: "#1D4ED8" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-0" style={{ backgroundColor: "#F9FAFB" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pays couverts</p>
                <p className="text-3xl font-bold mt-2" style={{ color: "#171717" }}>
                  {stats.byCountry.length}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "#EBF5FF" }}>
                <Globe className="h-6 w-6" style={{ color: "#1D4ED8" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}