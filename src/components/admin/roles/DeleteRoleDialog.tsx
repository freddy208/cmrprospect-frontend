/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/roles/DeleteRoleDialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { deleteRole } from "@/lib/api";
import { Role } from "@/types/role";
import { toast } from "sonner";

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onSuccess: () => void;
}

export function DeleteRoleDialog({ open, onOpenChange, role, onSuccess }: DeleteRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteRole(role.id);
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la suppression du rôle:", error);
      toast.error(error?.response?.data?.message || "Une erreur est survenue lors de la suppression du rôle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[425px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Supprimer le rôle
                </DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium">{role.name}</h4>
                  {role.description && (
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    {role._count.users} utilisateur(s) associé(s)
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Suppression en cours...
                    </div>
                  ) : (
                    "Supprimer"
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}