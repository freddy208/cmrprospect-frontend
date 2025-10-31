// src/types/comment.ts

// Type principal pour un commentaire, basé sur le modèle Prisma et le `include` du service
export type Comment = {
  id: string;
  content: string;
  prospectId: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: string; // Les dates sont souvent des string en JSON
  prospect: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    country: string;
  };
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    role: {
      name: string;
    };
  };
};

// Type pour la création d'un commentaire (correspond à CreateCommentDto du backend)
export type CreateCommentData = {
  content: string;
  prospectId: string;
};

// Type pour la mise à jour d'un commentaire
export type UpdateCommentData = {
  content: string;
};

// Type pour le filtre des commentaires (correspond à FilterCommentDto du backend)
export type CommentFilter = {
  prospectId?: string;
  userId?: string;
  content?: string; // Recherche "contains"
};