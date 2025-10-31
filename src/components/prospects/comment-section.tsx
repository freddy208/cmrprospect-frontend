/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/comment-section.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquarePlus, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createComment } from "@/lib/api"; // Modification ici
import { toast } from "sonner";
import { CommentList } from "./comment-list";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

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
      // Modification ici : utilisation de createComment avec les bons paramètres
      await createComment({
        content: newComment,
        prospectId: prospectId,
      });
      setNewComment("");
      toast.success("Commentaire ajouté !");
      // Forcer un rafraîchissement des commentaires
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
            <MessageSquarePlus className="h-5 w-5" style={{ color: "#1D4ED8" }} />
            Commentaires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment List */}
          <CommentList prospectId={prospectId} />

          <Separator />

          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback style={{ backgroundColor: "#EBF5FF", color: "#1D4ED8" }}>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    style={{ backgroundColor: "#1D4ED8" }}
                    className="text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}