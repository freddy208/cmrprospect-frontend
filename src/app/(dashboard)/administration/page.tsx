/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/administration/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Shield, 
  Key, 
  Activity,
  TrendingUp,
  BarChart3,
  UserPlus,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useRoles } from "@/hooks/useRoles";
import { useUsers } from "@/hooks/useUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { useAdminContext } from "@/hooks/useAdminContext";
import { useRouter } from "next/navigation";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="p-2 bg-blue-100 rounded-md">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className="flex items-center pt-1">
              <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </p>
              <TrendingUp className={`ml-1 h-3 w-3 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { setActiveSection } = useAdminContext();
  const { roles } = useRoles({ autoFetch: true });
  const { users } = useUsers({ autoFetch: true });
  const { permissions } = usePermissions({ autoFetch: true });

  useEffect(() => {
    setActiveSection("dashboard");
  }, [setActiveSection]);

  const recentUsers = users.slice(0, 5);
  const rolesWithMostUsers = [...roles].sort((a, b) => b._count.users - a._count.users).slice(0, 3);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord d&apos;administration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d&apos;ensemble de la gestion des rôles et permissions
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Utilisateurs"
            value={users.length}
            description="Utilisateurs actifs"
            icon={<Users className="h-4 w-4 text-blue-600" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Rôles"
            value={roles.length}
            description="Rôles définis"
            icon={<Shield className="h-4 w-4 text-blue-600" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Permissions"
            value={permissions.length}
            description="Permissions disponibles"
            icon={<Key className="h-4 w-4 text-blue-600" />}
          />
          <StatCard
            title="Activité"
            value={87}
            description="Actions cette semaine"
            icon={<Activity className="h-4 w-4 text-blue-600" />}
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Utilisateurs récents */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Utilisateurs récents</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigate("/administration/users")}
                >
                  Voir tout
                </Button>
              </div>
              <CardDescription>
                Les derniers utilisateurs ajoutés au système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.email
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {user.role.name}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rôles les plus utilisés */}
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rôles les plus utilisés</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigate("/administration/roles")}
                >
                  Voir tout
                </Button>
              </div>
              <CardDescription>
                Rôles avec le plus d&apos;utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rolesWithMostUsers.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {role.name}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        {role._count.users} utilisateur(s)
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-sm font-medium">{role._count.users}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités d&apos;administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start"
                onClick={() => handleNavigate("/administration/users")}
              >
                <UserPlus className="h-5 w-5 mb-2" />
                <span className="font-medium">Créer un utilisateur</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Ajouter un nouvel utilisateur
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start"
                onClick={() => handleNavigate("/administration/roles")}
              >
                <Shield className="h-5 w-5 mb-2" />
                <span className="font-medium">Créer un rôle</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Définir un nouveau rôle
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start"
                onClick={() => handleNavigate("/administration/permissions")}
              >
                <Key className="h-5 w-5 mb-2" />
                <span className="font-medium">Gérer les permissions</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Consulter les permissions
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start"
                onClick={() => handleNavigate("/administration/settings")}
              >
                <BarChart3 className="h-5 w-5 mb-2" />
                <span className="font-medium">Paramètres</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Configurer le système
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}