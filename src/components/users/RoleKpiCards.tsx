"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Crown,
  Globe,
  Briefcase,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { IUser } from "@/types/user";

interface RoleKpiCardsProps {
  users: IUser[];
  isLoading?: boolean;
}

export default function RoleKpiCards({ users, isLoading }: RoleKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive && u.status === "ACTIVE").length;
  const directeurs = users.filter((u) => u.role === "DIRECTEUR_GENERAL").length;
  const countryManagers = users.filter((u) => u.role === "COUNTRY_MANAGER").length;
  const salesOfficers = users.filter((u) => u.role === "SALES_OFFICER").length;

  const kpiData = [
    {
      title: "Total Utilisateurs",
      value: totalUsers,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      trend: "+12%",
      trendUp: true,
      bgColor: "bg-blue-50",
      description: "Tous les utilisateurs",
    },
    {
      title: "Utilisateurs Actifs",
      value: activeUsers,
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      trend: "+8%",
      trendUp: true,
      bgColor: "bg-green-50",
      description: "Actifs ce mois",
    },
    {
      title: "Directeurs Généraux",
      value: directeurs,
      icon: <Crown className="w-6 h-6 text-yellow-600" />,
      trend: "0%",
      trendUp: true,
      bgColor: "bg-yellow-50",
      description: "Direction",
    },
    {
      title: "Country Managers",
      value: countryManagers,
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      trend: "+3%",
      trendUp: true,
      bgColor: "bg-purple-50",
      description: "Par pays",
    },
    {
      title: "Sales Officers",
      value: salesOfficers,
      icon: <Briefcase className="w-6 h-6 text-orange-600" />,
      trend: "+15%",
      trendUp: true,
      bgColor: "bg-orange-50",
      description: "Commerciaux",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {kpi.title}
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {kpi.value}
                    </h3>
                    <div
                      className={`flex items-center text-xs font-medium ${
                        kpi.trendUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {kpi.trendUp ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {kpi.trend}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-xl`}>
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}