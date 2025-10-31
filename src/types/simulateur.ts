// src/types/simulateur.ts

// Type principal pour un simulateur, basé sur le modèle Prisma
export type Simulateur = {
  id: string;
  name: string;
  monthlyPrice: number;
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

// Type pour la création d'un simulateur (correspond à CreateSimulateurDto du backend)
export type CreateSimulateurData = {
  name: string;
  monthlyPrice: number;
  description: string;
  country: string;
};

// Type pour la mise à jour d'un simulateur
export type UpdateSimulateurData = Partial<Omit<CreateSimulateurData, 'country'>> & {
  status?: "ACTIVE" | "INACTIVE" | "DELETED";
};

// Type pour le filtre des simulateurs (correspond à FilterSimulateurDto du backend)
export type SimulateurFilter = {
  search?: string; // Recherche "contains" sur le nom
  country?: string;
  status?: Simulateur['status'];
};

// Types pour les statistiques
export type SimulateurStatsByCountry = {
  country: string;
  _count: {
    id: number;
  };
};

export type SimulateurStatsByManager = {
  createdById: string;
  _count: {
    id: number;
  };
};

export type SimulateurProspectStats = {
  id: string;
  name: string;
  totalProspects: number;
  country?: string;
};