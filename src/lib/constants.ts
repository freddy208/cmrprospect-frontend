// src/lib/constants.ts
export const ROLES = {
  DIRECTEUR_GENERAL: "DIRECTEUR_GENERAL",
  COUNTRY_MANAGER: "COUNTRY_MANAGER",
  SALES_OFFICER: "SALES_OFFICER",
} as const;

export const ROLE_LABEL: Record<string, string> = {
  DIRECTEUR_GENERAL: "Directeur général",
  COUNTRY_MANAGER: "Country Manager",
  SALES_OFFICER: "Sales Officer",
};

export const SERVICE_TYPE = {
  SIMULATEUR: "Simulateur",
  FORMATION:  "Formation",
} as const;

export const SERVICE_TYPE_LABEL: Record<string, string> = {
  SIMULATEUR: "Simulateur",
  FORMATION:  "Formation",
};

// --- CORRECTION CRUCIALE ---
// Mettez à jour les statuts pour qu'ils correspondent exactement à l'enum Prisma
export const PROSPECT_STATUS = {
  NOUVEAU: "Nouveau",
  QUALIFIE: "Qualifié",
  CONVERTI: "Converti",
  PAS_SERIEUX: "Pas sérieux",
  PERDU: "Perdu",
} as const;

// Labels pour l'affichage dans l'UI (plus joliment)
export const PROSPECT_STATUS_LABEL: Record<string, string> = {
  NOUVEAU: "Nouveau",
  QUALIFIE: "Qualifié",
  CONVERTI: "Converti",
  PAS_SERIEUX: "Pas sérieux",
  PERDU: "Perdu",
};
export const PROSPECT_TYPE = {
  PARTICULIER: "Particulier",
  ENTREPRISE: "Entreprise",
} as const;

export const PROSPECT_TYPE_LABEL: Record<string, string> = {
  PARTICULIER: "Particulier",
  ENTREPRISE: "Entreprise",
};

export const LEAD_CHANNEL = {
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  SITE_INTERNET: "Site Internet",
  VISITE_BUREAU: "Visite Bureau",
  VISITE_TERRAIN: "Visite Terrain",
  RECOMMANDATION: "Recommandation",
} as const;

export const LEAD_CHANNEL_LABEL: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  SITE_INTERNET: "Site Internet",
  VISITE_BUREAU: "Visite Bureau",
  VISITE_TERRAIN: "Visite Terrain",
  RECOMMANDATION: "Recommandation",
};

export const USER_STATUS = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DELETED: "Supprimé",
} as const;