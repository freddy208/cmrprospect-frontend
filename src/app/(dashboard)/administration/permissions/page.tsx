// src/app/administration/permissions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Copy,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { usePermissions } from "@/hooks/usePermissions";
import { useAdminContext } from "@/hooks/useAdminContext";
import { PERMISSION_GROUPS } from "@/lib/constants";
import { Permission } from "@/types/permission";
import { toast } from "sonner";

// ✅ Type strict pour les onglets, aligné sur les clés de PERMISSION_GROUPS
type PermissionTab = keyof typeof PERMISSION_GROUPS | "all" | "other";

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ Typage strict de l'état
  const [activeTab, setActiveTab] = useState<PermissionTab>("all");
 const { permissions, isLoading, error } = usePermissions({ autoFetch: true });
// ✅ Récupération directe sans déstructuration
  const { setActiveSection } = useAdminContext();

  useEffect(() => {
    setActiveSection("permissions");
  }, [setActiveSection]);

  const handleCopyPermissionName = (permissionName: string) => {
    navigator.clipboard.writeText(permissionName);
    toast.success("Nom de la permission copié dans le presse-papiers");
  };

  // ✅ Vérification que permissions est bien un tableau avant de filtrer
  const filteredPermissions = Array.isArray(permissions) ? permissions.filter((permission: Permission) => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // ✅ Gestion claire des cas spéciaux
    if (activeTab === "all" || activeTab === "other") return matchesSearch;
    
    // ✅ Cast propre et sécurisé
    const groupKey = activeTab as keyof typeof PERMISSION_GROUPS;
    return matchesSearch && PERMISSION_GROUPS[groupKey].includes(permission.name);
  }) : [];

  const getPermissionGroup = (permissionName: string): string => {
    // ✅ Parcours sécurisé des clés
    const groupKeys = Object.keys(PERMISSION_GROUPS) as Array<keyof typeof PERMISSION_GROUPS>;
    
    for (const groupKey of groupKeys) {
      if (PERMISSION_GROUPS[groupKey].includes(permissionName)) {
        return groupKey;
      }
    }
    return "other";
  };

  const getPermissionBadgeColor = (permissionName: string) => {
    const resource = permissionName.split(":")[0];
    switch (resource) {
      case "prospects": return "bg-blue-100 text-blue-800";
      case "roles": return "bg-purple-100 text-purple-800";
      case "users": return "bg-green-100 text-green-800";
      case "formations": return "bg-yellow-100 text-yellow-800";
      case "simulateurs": return "bg-indigo-100 text-indigo-800";
      case "interactions": return "bg-pink-100 text-pink-800";
      case "comments": return "bg-orange-100 text-orange-800";
      case "dashboard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des permissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consultez toutes les permissions disponibles dans le système
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une permission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <div className="flex">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PermissionTab)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="PROSPECTS">Prospects</TabsTrigger>
            <TabsTrigger value="USERS">Utilisateurs</TabsTrigger>
            <TabsTrigger value="ROLES">Rôles</TabsTrigger>
            <TabsTrigger value="other">Autres</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            { isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPermissions.map((permission: Permission, index: number) => (
                  <motion.div
                    key={permission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 rounded-md">
                              <Key className="h-4 w-4 text-blue-600" />
                            </div>
                            <CardTitle className="text-sm font-mono">{permission.name}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyPermissionName(permission.name)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {permission.description && (
                            <p className="text-sm text-gray-600">{permission.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="secondary" 
                              className={getPermissionBadgeColor(permission.name)}
                            >
                              {permission.name.split(":")[0]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getPermissionGroup(permission.name)}
                            </Badge>
                          </div>
                          
                          <div className="pt-2 text-xs text-gray-500">
                            Créée le {new Date(permission.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            { !isLoading && filteredPermissions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Key className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune permission trouvée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Essayez de modifier votre recherche" : "Il n'y a pas de permissions disponibles"}
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </AdminLayout>
  );
}