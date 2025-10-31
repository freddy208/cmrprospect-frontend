// src/app/(dashboard)/comments/components/CommentDetailsDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, User, MessageSquare } from "lucide-react";
import { type Comment } from "@/types/comment";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CommentDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  comment: Comment;
}

export function CommentDetailsDialog({ isOpen, onClose, comment }: CommentDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du commentaire</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Par {comment.user.firstName} {comment.user.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Le {format(new Date(comment.createdAt), 'Pp', { locale: fr })}</span>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: "#171717" }}>
              <MessageSquare className="h-4 w-4" />
              Commentaire
            </h4>
            <p className="text-sm text-gray-700 p-3 rounded-md" style={{ backgroundColor: "#F9FAFB" }}>{comment.content}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}