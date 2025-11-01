/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/roles/EditRoleDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissions } from "@/hooks/usePermissions";
import { updateRole } from "@/lib/api";
import { PERMISSION_GROUPS, PERMISSION_GROUP_LABEL, PERMISSION_LABEL } from "@/lib/constants";
import { Role, UpdateRoleData } from "@/types/role";
import { toast } from "sonner";

const updateRoleSchema = z.object({
  name: z.string().min(1, "Le nom du rôle est requis"),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).min(1, "Sélectionnez au moins une permission"),
});

type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onSuccess: () => void;
}

export function EditRoleDialog({ open, onOpenChange, role, onSuccess }: EditRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { permissions, isLoading: permissionsLoading } = usePermissions({ autoFetch: true });
  
  const form = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: role.name,
      description: role.description || "",
      permissionIds: role.permissions.map(p => p.id),
    },
  });

  const watchedPermissionIds = form.watch("permissionIds");

  useEffect(() => {
    if (open) {
      form.reset({
        name: role.name,
        description: role.description || "",
        permissionIds: role.permissions.map(p => p.id),
      });
    }
  }, [open, role, form]);

  const handleTogglePermission = (permissionName: string, checked: boolean) => {
  const permission = permissions.find(p => p.name === permissionName);
  if (!permission) return;
  
  const currentPermissions = form.getValues("permissionIds");
  if (checked) {
    form.setValue("permissionIds", [...currentPermissions, permission.id]);
  } else {
    form.setValue(
      "permissionIds",
      currentPermissions.filter((id) => id !== permission.id)
    );
  }
};

const handleToggleGroup = (groupPermissions: readonly string[], checked: boolean) => {
  const currentPermissions = form.getValues("permissionIds");
  
  // Convertir les NOMS en IDs
  const groupPermissionIds = groupPermissions
    .map(name => permissions.find(p => p.name === name)?.id)
    .filter(Boolean) as string[];
  
  if (checked) {
    const newPermissions = [
      ...currentPermissions,
      ...groupPermissionIds.filter(id => !currentPermissions.includes(id))
    ];
    form.setValue("permissionIds", newPermissions);
  } else {
    form.setValue(
      "permissionIds",
      currentPermissions.filter(id => !groupPermissionIds.includes(id))
    );
  }
};

const isGroupFullySelected = (groupPermissions: readonly string[]) => {
  const groupPermissionIds = groupPermissions
    .map(name => permissions.find(p => p.name === name)?.id)
    .filter(Boolean) as string[];
  return groupPermissionIds.every(id => watchedPermissionIds.includes(id));
};

const isGroupPartiallySelected = (groupPermissions: readonly string[]) => {
  const groupPermissionIds = groupPermissions
    .map(name => permissions.find(p => p.name === name)?.id)
    .filter(Boolean) as string[];
  return groupPermissionIds.some(id => watchedPermissionIds.includes(id)) && 
         !isGroupFullySelected(groupPermissions);
};

  const onSubmit = async (data: UpdateRoleFormValues) => {
    setIsSubmitting(true);
    try {
      await updateRole(role.id, data);
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast.error(error?.response?.data?.message || "Une erreur est survenue lors de la mise à jour du rôle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>Modifier le rôle</DialogTitle>
                <DialogDescription>
                  Mettez à jour les informations et permissions du rôle
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du rôle</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Directeur général" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Décrivez le rôle et ses responsabilités" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div>
                    <FormLabel className="text-base font-medium">Permissions</FormLabel>
                    <FormDescription className="mb-4">
                      Sélectionnez les permissions à attribuer à ce rôle
                    </FormDescription>
                    
                    {permissionsLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <ScrollArea className="h-64 pr-4">
                        <div className="space-y-4">
                          {Object.entries(PERMISSION_GROUPS).map(([groupKey, groupPermissions]) => (
                            <div key={groupKey} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                {groupPermissions.map((permissionName) => {
  const permissionData = permissions.find(p => p.name === permissionName);
  if (!permissionData) return null;
  
  return (
    <div key={permissionName} className="flex items-center space-x-2">
      <Checkbox
        id={permissionName}
        checked={watchedPermissionIds.includes(permissionData.id)}
        onCheckedChange={(checked) => 
          handleTogglePermission(permissionName, checked as boolean)
        }
      />
      <label 
        htmlFor={permissionName}
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        {PERMISSION_LABEL[permissionName] || permissionName}
      </label>
    </div>
  );
})}
                                <label 
                                  htmlFor={`group-${groupKey}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {PERMISSION_GROUP_LABEL[groupKey]}
                                </label>
                                {isGroupPartiallySelected(groupPermissions) && (
                                  <Badge variant="outline" className="text-xs">
                                    Partiel
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="ml-6 space-y-2">
                                {groupPermissions.map((permission) => {
                                  const permissionData = permissions.find(p => p.name === permission);
                                  return (
                                    <div key={permission} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={permission}
                                        checked={watchedPermissionIds.includes(permission)}
                                        onCheckedChange={(checked) => 
                                          handleTogglePermission(permission, checked as boolean)
                                        }
                                      />
                                      <label 
                                        htmlFor={permission}
                                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                      >
                                        {PERMISSION_LABEL[permission] || permission}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mise à jour en cours...
                        </div>
                      ) : (
                        "Mettre à jour le rôle"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}