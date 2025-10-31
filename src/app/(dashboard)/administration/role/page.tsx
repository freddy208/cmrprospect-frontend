/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/administration/roles/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Shield,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CreateRoleDialog } from "@/components/admin/roles/CreateRoleDialog";
import { EditRoleDialog } from "@/components/admin/roles/EditRoleDialog";
import { DeleteRoleDialog } from "@/components/admin/roles/DeleteRoleDialog";
import { useRoles } from "@/hooks/useRoles";
import { useAdminContext } from "@/hooks/useAdminContext";
import { toast } from "sonner";
import { Role } from "@/types/role";

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const { roles, isLoading, error, refetch } = useRoles({ autoFetch: true });
  const { setActiveSection } = useAdminContext();

  useEffect(() => {
    setActiveSection("roles");
  }, [setActiveSection]);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleRoleCreated = () => {
    refetch();
    setIsCreateDialogOpen(false);
    toast.success("Rôle créé avec succès");
  };

  const handleRoleUpdated = () => {
    refetch();
    setIsEditDialogOpen(false);
    setSelectedRole(null);
    toast.success("Rôle mis à jour avec succès");
  };

  const handleRoleDeleted = () => {
    refetch();
    setIsDeleteDialogOpen(false);
    setSelectedRole(null);
    toast.success("Rôle supprimé avec succès");
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des rôles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les rôles et leurs permissions dans le système
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un rôle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rôle
          </Button>
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-md">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditRole(role)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRole(role)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {role.description && (
                      <CardDescription className="text-sm">
                        {role.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Permissions</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {role.permissions.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Utilisateurs</span>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-700">{role._count.users}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission.id} variant="outline" className="text-xs">
                              {permission.name.split(':')[0]}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredRoles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rôle trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par créer un nouveau rôle"}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau rôle
              </Button>
            </div>
          </motion.div>
        )}

        {/* Dialogues */}
        <CreateRoleDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={handleRoleCreated}
        />

        {selectedRole && (
          <>
            <EditRoleDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              role={selectedRole}
              onSuccess={handleRoleUpdated}
            />
            <DeleteRoleDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              role={selectedRole}
              onSuccess={handleRoleDeleted}
            />
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
}