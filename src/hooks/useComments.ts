/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useComments.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getComments, createComment, updateComment, deleteComment } from "@/lib/api";
import { 
  Comment, 
  CommentFilter, 
  CreateCommentData, 
  UpdateCommentData 
} from "@/types/comment";

type UseCommentsOptions = {
  initialFilter?: CommentFilter;
  autoFetch?: boolean;
};

type UseCommentsReturn = {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  refetch: (newFilter?: CommentFilter) => Promise<void>;
  create: (data: CreateCommentData) => Promise<Comment | null>;
  update: (id: string, data: UpdateCommentData) => Promise<Comment | null>;
  remove: (id: string) => Promise<boolean>;
};

export function useComments({ initialFilter, autoFetch = true }: UseCommentsOptions = {}): UseCommentsReturn {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CommentFilter>(initialFilter || {});

  const fetchComments = useCallback(async (currentFilter: CommentFilter) => {
    if (!user) {
      setError("Utilisateur non connecté");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComments(currentFilter);
      // S'assurer que chaque commentaire a un utilisateur
      const commentsWithUser = data.map(comment => ({
        ...comment,
        user: comment.user || {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      }));
      setComments(commentsWithUser);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des commentaires:", err);
      setError(err?.response?.data?.message || "Une erreur est survenue.");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (autoFetch) {
      fetchComments(filter);
    }
  }, [fetchComments, filter, autoFetch]);

  const refetch = useCallback(async (newFilter?: CommentFilter) => {
    const finalFilter = newFilter || filter;
    setFilter(finalFilter);
    await fetchComments(finalFilter);
  }, [fetchComments, filter]);

  const createCommentHandler = useCallback(async (data: CreateCommentData): Promise<Comment | null> => {
    if (!user) return null;
    try {
      const newComment = await createComment(data);
      // S'assurer que le nouveau commentaire a un utilisateur
      const commentWithUser = {
        ...newComment,
        user: newComment.user || {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      };
      setComments(prev => [commentWithUser, ...prev]);
      return commentWithUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création.");
      return null;
    }
  }, [user]);

  const updateCommentHandler = useCallback(async (id: string, data: UpdateCommentData): Promise<Comment | null> => {
    if (!user) {
      setError("Utilisateur non connecté");
      return null;
    }
    
    try {
      const updatedComment = await updateComment(id, data);
      // S'assurer que le commentaire mis à jour a un utilisateur
      const commentWithUser = {
        ...updatedComment,
        user: updatedComment.user || {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      };
      setComments(prev => prev.map(c => c.id === id ? commentWithUser : c));
      return commentWithUser;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour.");
      return null;
    }
  }, [user]);

  const deleteCommentHandler = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
      return false;
    }
  }, []);

  return {
    comments,
    isLoading,
    error,
    refetch,
    create: createCommentHandler,
    update: updateCommentHandler,
    remove: deleteCommentHandler,
  };
}

export function useCommentsForProspect(prospectId: string) {
  return useComments({ initialFilter: { prospectId } });
}