// src/components/formations/FormationStatsCards.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, Globe } from "lucide-react";
import { FormationStatsByCountry, FormationStatsByManager, FormationProspectStats } from "@/types/formation";
import { Skeleton } from "../ui/skeleton";

interface FormationStatsCardsProps {
  stats: {
    byCountry: FormationStatsByCountry[];
    byManager: FormationStatsByManager[];
    totalCount: number;
    prospectStats: FormationProspectStats[];
  };
  isLoading: boolean;
}

export function FormationStatsCards({ stats, isLoading }: FormationStatsCardsProps) {
  const totalProspects = stats.prospectStats.reduce((sum, stat) => sum + stat.totalProspects, 0);
  const averageProspectsPerFormation = stats.prospectStats.length > 0 
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
                <p className="text-sm font-medium text-gray-600">Total formations</p>
                <p className="text-3xl font-bold mt-2" style={{ color: "#171717" }}>
                  {stats.totalCount}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "#EBF5FF" }}>
                <BookOpen className="h-6 w-6" style={{ color: "#1D4ED8" }} />
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
              <div className="p-3 rounded-full" style={{ backgroundColor: "#FEF3C7" }}>
                <Users className="h-6 w-6" style={{ color: "#FBBF24" }} />
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
                <p className="text-sm font-medium text-gray-600">Moyenne par formation</p>
                <p className="text-3xl font-bold mt-2" style={{ color: "#171717" }}>
                  {averageProspectsPerFormation}
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