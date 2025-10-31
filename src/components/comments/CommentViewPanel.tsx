/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/comments/components/CommentViewPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProspect } from "@/lib/api";
import { useCommentsForProspect } from "@/hooks/useComments";
import { CommentItem } from "./CommentItem";
import { CommentEditDialog } from "./CommentEditDialog";
import { cn } from "@/lib/utils";
import { Prospect } from "@/types/prospect";

interface CommentViewPanelProps {
  prospectId: string;
  onBack: () => void;
}

export function CommentViewPanel({ prospectId, onBack }: CommentViewPanelProps) {
  const { comments, isLoading, error, create, update, remove } = useCommentsForProspect(prospectId);
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<any>(null);

  useEffect(() => {
    const fetchProspectDetails = async () => {
      try {
        const data = await getProspect(prospectId);
        setProspect(data);
      } catch (err) {
        console.error("Failed to fetch prospect details:", err);
      }
    };
    fetchProspectDetails();
  }, [prospectId]);

  const handleCreateNew = () => {
    setEditingComment(null); // Mode création
    setIsEditDialogOpen(true);
  };

  const handleEdit = (comment: any) => {
    setEditingComment(comment); // Mode édition
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <motion.div 
        layoutId={`prospect-${prospectId}`}
        className="p-4 border-b border-gray-200 bg-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "#171717" }}>
                {prospect ? `${prospect.firstName} ${prospect.lastName}` : "Chargement..."}
              </h2>
              <p className="text-sm text-gray-500">{prospect?.email}</p>
            </div>
          </div>
          <Button 
            onClick={handleCreateNew} 
            className="flex items-center gap-2"
            style={{ backgroundColor: "#1D4ED8" }}
          >
            <PlusCircle className="h-4 w-4" />
            Nouveau commentaire
          </Button>
        </div>
      </motion.div>

      {/* Liste des commentaires */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && <p>Chargement des commentaires...</p>}
        {error && <p style={{ color: "red" }}>Erreur: {error}</p>}
        {!isLoading && !error && comments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="h-12 w-12 mb-4" style={{ color: "#1D4ED8" }} />
            <p>Aucun commentaire pour ce prospect.</p>
            <p>Cliquez sur &quot;Nouveau commentaire&quot; pour commencer.</p>
          </div>
        )}
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEdit={handleEdit}
              onDelete={remove}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de création/édition */}
      <CommentEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        prospectId={prospectId}
        comment={editingComment}
        onSubmit={async (data) => {
            if (editingComment) {
            await update(editingComment.id, data as any);
            } else {
            await create(data as any);
            }
        }}
        />

    </div>
  );
}