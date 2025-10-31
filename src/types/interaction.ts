// src/types/interaction.ts

// Type principal pour une interaction, basé sur le modèle Prisma et le `include` du service
export type Interaction = {
  id: string;
  prospectId: string;
  userId: string;
  channel?: "WHATSAPP" | "EMAIL" | "SITE_INTERNET" | "VISITE_BUREAU" | "VISITE_TERRAIN" | "RECOMMANDATION" | null;
  notes: string;
  duration?: number | null;
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

// Type pour la création d'une interaction (correspond à CreateInteractionDto du backend)
export type CreateInteractionData = {
  prospectId: string;
  channel: "WHATSAPP" | "EMAIL" | "SITE_INTERNET" | "VISITE_BUREAU" | "VISITE_TERRAIN" | "RECOMMANDATION"; // Type strict, non-nullable
  notes: string;
  duration?: number; // Le formulaire envoie un number ou undefined
};

// On réutilise le type strict de CreateInteractionData pour la mise à jour
export type UpdateInteractionData = Partial<Omit<CreateInteractionData, 'prospectId'>>;

// Type pour le filtre des interactions (correspond à FilterInteractionDto du backend)
export type InteractionFilter = {
  prospectId?: string;
  userId?: string;
  channel?: Interaction['channel'];
  notes?: string; // Recherche "contains"
};