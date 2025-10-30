// src/components/prospects/comment-list.tsx
"use client";

import { getCommentsForProspect } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import type { Comment } from "@/types/index";

interface CommentListProps {
  prospectId: string;
}

export function CommentList({ prospectId }: CommentListProps) {
  // --- CORRECTION : Le type générique est maintenant Comment[] ---
  const { data, isLoading, error } = useQuery<Comment[]>({
    queryKey: ["comments", prospectId],
    queryFn: () => getCommentsForProspect(prospectId),
  });

  if (isLoading) return <div>Chargement des commentaires...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div className="space-y-4">
      {/* data est maintenant correctement typé comme un tableau Comment[] */}
      {/* TypeScript sait donc que 'comment' est de type Comment */}
      {data?.map((comment) => (
        <div key={comment.id} className="flex space-x-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback>
              {comment.user.firstName?.charAt(0)}
              {comment.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{comment.user.firstName} {comment.user.lastName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
              </p>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}