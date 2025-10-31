/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/prospects/delete-prospect-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Prospect } from "@/types/prospect";
import { useDeleteProspect } from "@/hooks/use-delete-prospect";
import { motion } from "framer-motion";

interface DeleteProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prospect: Prospect;
}

export function DeleteProspectDialog({
  isOpen,
  onClose,
  onSuccess,
  prospect,
}: DeleteProspectDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const { deleteProspect, isDeleting } = useDeleteProspect();

  // Obtenir le nom à afficher
  const getDisplayName = () => {
    if (prospect.type === 'ENTREPRISE' && prospect.companyName) {
      return prospect.companyName;
    }
    return `${prospect.firstName || ''} ${prospect.lastName || ''}`.trim() || 'Sans nom';
  };

  const handleDelete = async () => {
    if (confirmationText !== "SUPPRIMER") {
      toast.error("Veuillez taper 'SUPPRIMER' pour confirmer");
      return;
    }

    try {
      await deleteProspect(prospect.id);
      toast.success("Prospect supprimé avec succès");
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la suppression du prospect:", error);
      toast.error(error.message || "Une erreur est survenue lors de la suppression");
    }
  };

  const isButtonDisabled = confirmationText !== "SUPPRIMER" || isDeleting;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Supprimer le prospect
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le prospect sera définitivement supprimé.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Vous êtes sur le point de supprimer le prospect : <strong>{getDisplayName()}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Pour confirmer, tapez <span className="font-mono font-bold">SUPPRIMER</span> dans le champ ci-dessous :
              </p>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Tapez SUPPRIMER"
                className="border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="mr-2"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isButtonDisabled}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}