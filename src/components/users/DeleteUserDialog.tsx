// src/components/users/DeleteUserDialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
}

export function DeleteUserDialog({ isOpen, onClose, onConfirm, userName }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Supprimer l&apos;utilisateur
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Cette action est irréversible. L&apos;utilisateur sera marqué comme supprimé et ne pourra plus se connecter.
                  </AlertDescription>
                </Alert>

                <p>
                  Êtes-vous sûr de vouloir supprimer l&apos;utilisateur <strong>{userName}</strong> ?
                </p>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isLoading ? "Suppression..." : "Supprimer"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}