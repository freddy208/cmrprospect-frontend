// src/app/(dashboard)/comments/components/CommentEditDialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CommentForm } from "./CommentForm";
import { type Comment, type CreateCommentData, type UpdateCommentData } from "@/types/comment";

interface CommentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
  comment?: Comment | null; // null pour la création
  onSubmit: (data: CreateCommentData | UpdateCommentData) => Promise<void>;
}

// Fonction pour transformer un Comment en valeurs par défaut valides pour le formulaire
const transformCommentToFormValues = (comment?: Comment | null) => {
  if (!comment) return {};
  
  return {
    content: comment.content || "",
  };
};

export function CommentEditDialog({ isOpen, onClose, prospectId, comment, onSubmit }: CommentEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: CreateCommentData | UpdateCommentData) => {
    setIsLoading(true);
    try {
      await onSubmit({ ...data, prospectId });
      onClose();
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transformer les valeurs par défaut si elles viennent d'un objet Comment
  const formDefaultValues = transformCommentToFormValues(comment);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{comment ? "Modifier le commentaire" : "Ajouter un commentaire"}</DialogTitle>
        </DialogHeader>
        <CommentForm
          prospectId={prospectId}
          defaultValues={formDefaultValues}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}