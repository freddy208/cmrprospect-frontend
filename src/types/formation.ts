// src/types/formation.ts

// Type principal pour une formation, basé sur le modèle Prisma
export type Formation = {
  id: string;
  name: string;
  price: number;
  description: string;
  country: string;
  createdById: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: string; // Les dates sont souvent des string en JSON
  updatedAt: string;
  createdBy?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  // Optionnel: inclure le nombre de prospects associés
  _count?: {
    prospects: number;
  };
};

// Type pour la création d'une formation (correspond à CreateFormationDto du backend)
export type CreateFormationData = {
  name: string;
  price: number;
  description: string;
  country: string;
};

// Type pour la mise à jour d'une formation
export type UpdateFormationData = Partial<Omit<CreateFormationData, 'country'>> & {
  status?: "ACTIVE" | "INACTIVE" | "DELETED";
};

// Type pour le filtre des formations (correspond à FilterFormationDto du backend)
export type FormationFilter = {
  search?: string; // Recherche "contains" sur le nom
  country?: string;
  status?: Formation['status'];
};

// Types pour les statistiques
export type FormationStatsByCountry = {
  country: string;
  _count: {
    id: number;
  };
};

export type FormationStatsByManager = {
  createdById: string;
  _count: {
    id: number;
  };
};

export type FormationProspectStats = {
  id: string;
  name: string;
  totalProspects: number;
  country?: string;
};