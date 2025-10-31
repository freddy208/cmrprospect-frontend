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
  WHATSAPP: "WHATSAPP",
  EMAIL: "EMAIL",
  SITE_INTERNET: "SITE_INTERNET",
  VISITE_BUREAU: "VISITE_BUREAU",
  VISITE_TERRAIN: "VISITE_TERRAIN",
  RECOMMANDATION: "RECOMMANDATION",
} as const;

export const LEAD_CHANNEL_LABEL: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  SITE_INTERNET: "Site Internet",
  VISITE_BUREAU: "Visite Bureau",
  VISITE_TERRAIN: "Visite Terrain",
  RECOMMANDATION: "Recommandation",
};

export const INTERACTION_TYPE = {
  APPEL_TELEPHONIQUE: "APPEL_TELEPHONIQUE",
  EMAIL: "EMAIL",
  VISITE: "VISITE",
  REUNION: "REUNION",
  SMS_WHATSAPP: "SMS_WHATSAPP",
  AUTRE: "AUTRE",
} as const;

export const INTERACTION_TYPE_LABEL: Record<string, string> = {
  APPEL_TELEPHONIQUE: "Appel téléphonique",
  EMAIL: "E-mail",
  VISITE: "Visite",
  REUNION: "Réunion",
  SMS_WHATSAPP: "SMS/WhatsApp",
  AUTRE: "Autre",
};

export const USER_STATUS = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DELETED: "Supprimé",
} as const;

// --- NOUVELLES CONSTANTES POUR LES INTERACTIONS ---

