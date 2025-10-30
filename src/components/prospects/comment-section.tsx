/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/comment-section.tsx
"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquarePlus, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { addCommentToProspect } from "@/lib/api";
import { toast } from "sonner";
import { CommentList } from "./comment-list";
import { Separator } from "@radix-ui/react-select";

interface CommentSectionProps {
  prospectId: string;
}

export function CommentSection({ prospectId }: CommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentToProspect(prospectId, newComment);
      setNewComment("");
      toast.success("Commentaire ajouté !");
      // You might want to trigger a refetch of the comments here
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Commentaires</h3>
      <Separator />
      
      {/* Comment List */}
      <CommentList prospectId={prospectId} />

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isSubmitting}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}