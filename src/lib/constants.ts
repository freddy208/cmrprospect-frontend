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
  SIMULATEUR: "SIMULATEUR",
  FORMATION:  "FORMATION",
} as const;

export const SERVICE_TYPE_LABEL: Record<string, string> = {
  SIMULATEUR: "Simulateur",
  FORMATION:  "Formation",
};

// --- CORRECTION CRUCIALE ---
// Mettez à jour les statuts pour qu'ils correspondent exactement à l'enum Prisma
export const PROSPECT_STATUS = {
  NOUVEAU: "NOUVEAU",
  QUALIFIE: "QUALIFIE",
  CONVERTI: "CONVERTI",
  PAS_SERIEUX: "PAS_SERIEUX",
  PERDU: "PERDU",
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
  PARTICULIER: "PARTICULIER",
  ENTREPRISE: "ENTREPRISE",
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
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export const USER_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DELETED: "Supprimé",
};

// --- NOUVELLES CONSTANTES POUR LES INTERACTIONS ---

export const COMMENT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export const COMMENT_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DELETED: "Supprimé",
};

export const FORMATION_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export const FORMATION_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DELETED: "Supprimé",
};

export const SIMULATEUR_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export const SIMULATEUR_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DELETED: "Supprimé",
};

// Nouvelles constantes pour les permissions
export const PERMISSIONS = {
  // Permissions pour les prospects
  PROSPECTS_READ: "prospects:read",
  PROSPECTS_CREATE: "prospects:create",
  PROSPECTS_UPDATE: "prospects:update",
  PROSPECTS_DELETE: "prospects:delete",
  
  // Permissions pour les rôles
  ROLES_READ: "roles:read",
  ROLES_CREATE: "roles:create",
  ROLES_UPDATE: "roles:update",
  ROLES_DELETE: "roles:delete",
  
  // Permissions pour les permissions
  PERMISSIONS_READ: "permissions:read",
  
  // Permissions pour les utilisateurs
  USERS_READ: "users:read",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  
  // Permissions pour les formations
  FORMATIONS_READ: "formations:read",
  FORMATIONS_CREATE: "formations:create",
  FORMATIONS_UPDATE: "formations:update",
  FORMATIONS_DELETE: "formations:delete",
  
  // Permissions pour les simulateurs
  SIMULATEURS_READ: "simulateurs:read",
  SIMULATEURS_CREATE: "simulateurs:create",
  SIMULATEURS_UPDATE: "simulateurs:update",
  SIMULATEURS_DELETE: "simulateurs:delete",
  
  // Permissions pour les interactions
  INTERACTIONS_READ: "interactions:read",
  INTERACTIONS_CREATE: "interactions:create",
  INTERACTIONS_UPDATE: "interactions:update",
  INTERACTIONS_DELETE: "interactions:delete",
  
  // Permissions pour les commentaires
  COMMENTS_READ: "comments:read",
  COMMENTS_CREATE: "comments:create",
  COMMENTS_UPDATE: "comments:update",
  COMMENTS_DELETE: "comments:delete",
  
  // Permissions pour le tableau de bord
  DASHBOARD_READ: "dashboard:read",
} as const;

export const PERMISSION_LABEL: Record<string, string> = {
  // Permissions pour les prospects
  [PERMISSIONS.PROSPECTS_READ]: "Voir les prospects",
  [PERMISSIONS.PROSPECTS_CREATE]: "Créer des prospects",
  [PERMISSIONS.PROSPECTS_UPDATE]: "Modifier des prospects",
  [PERMISSIONS.PROSPECTS_DELETE]: "Supprimer des prospects",
  
  // Permissions pour les rôles
  [PERMISSIONS.ROLES_READ]: "Voir les rôles",
  [PERMISSIONS.ROLES_CREATE]: "Créer des rôles",
  [PERMISSIONS.ROLES_UPDATE]: "Modifier des rôles",
  [PERMISSIONS.ROLES_DELETE]: "Supprimer des rôles",
  
  // Permissions pour les permissions
  [PERMISSIONS.PERMISSIONS_READ]: "Voir les permissions",
  
  // Permissions pour les utilisateurs
  [PERMISSIONS.USERS_READ]: "Voir les utilisateurs",
  [PERMISSIONS.USERS_CREATE]: "Créer des utilisateurs",
  [PERMISSIONS.USERS_UPDATE]: "Modifier des utilisateurs",
  [PERMISSIONS.USERS_DELETE]: "Supprimer des utilisateurs",
  
  // Permissions pour les formations
  [PERMISSIONS.FORMATIONS_READ]: "Voir les formations",
  [PERMISSIONS.FORMATIONS_CREATE]: "Créer des formations",
  [PERMISSIONS.FORMATIONS_UPDATE]: "Modifier des formations",
  [PERMISSIONS.FORMATIONS_DELETE]: "Supprimer les formations",
  
  // Permissions pour les simulateurs
  [PERMISSIONS.SIMULATEURS_READ]: "Voir les simulateurs",
  [PERMISSIONS.SIMULATEURS_CREATE]: "Créer des simulateurs",
  [PERMISSIONS.SIMULATEURS_UPDATE]: "Modifier des simulateurs",
  [PERMISSIONS.SIMULATEURS_DELETE]: "Supprimer les simulateurs",
  
  // Permissions pour les interactions
  [PERMISSIONS.INTERACTIONS_READ]: "Voir les interactions",
  [PERMISSIONS.INTERACTIONS_CREATE]: "Créer des interactions",
  [PERMISSIONS.INTERACTIONS_UPDATE]: "Modifier des interactions",
  [PERMISSIONS.INTERACTIONS_DELETE]: "Supprimer les interactions",
  
  // Permissions pour les commentaires
  [PERMISSIONS.COMMENTS_READ]: "Voir les commentaires",
  [PERMISSIONS.COMMENTS_CREATE]: "Créer des commentaires",
  [PERMISSIONS.COMMENTS_UPDATE]: "Modifier des commentaires",
  [PERMISSIONS.COMMENTS_DELETE]: "Supprimer les commentaires",
  
  // Permissions pour le tableau de bord
  [PERMISSIONS.DASHBOARD_READ]: "Voir le tableau de bord",
};

// Groupes de permissions pour faciliter l'assignation - CORRECTION: Supprimer as const
export const PERMISSION_GROUPS: Record<string, string[]> = {
  PROSPECTS: [
    PERMISSIONS.PROSPECTS_READ,
    PERMISSIONS.PROSPECTS_CREATE,
    PERMISSIONS.PROSPECTS_UPDATE,
    PERMISSIONS.PROSPECTS_DELETE,
  ],
  ROLES: [
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_UPDATE,
    PERMISSIONS.ROLES_DELETE,
  ],
  USERS: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
  ],
  FORMATIONS: [
    PERMISSIONS.FORMATIONS_READ,
    PERMISSIONS.FORMATIONS_CREATE,
    PERMISSIONS.FORMATIONS_UPDATE,
    PERMISSIONS.FORMATIONS_DELETE,
  ],
  SIMULATEURS: [
    PERMISSIONS.SIMULATEURS_READ,
    PERMISSIONS.SIMULATEURS_CREATE,
    PERMISSIONS.SIMULATEURS_UPDATE,
    PERMISSIONS.SIMULATEURS_DELETE,
  ],
  INTERACTIONS: [
    PERMISSIONS.INTERACTIONS_READ,
    PERMISSIONS.INTERACTIONS_CREATE,
    PERMISSIONS.INTERACTIONS_UPDATE,
    PERMISSIONS.INTERACTIONS_DELETE,
  ],
  COMMENTS: [
    PERMISSIONS.COMMENTS_READ,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_UPDATE,
    PERMISSIONS.COMMENTS_DELETE,
  ],
  DASHBOARD: [
    PERMISSIONS.DASHBOARD_READ,
  ],
} 

export const PERMISSION_GROUP_LABEL: Record<string, string> = {
  PROSPECTS: "Gestion des prospects",
  ROLES: "Gestion des rôles",
  USERS: "Gestion des utilisateurs",
  FORMATIONS: "Gestion des formations",
  SIMULATEURS: "Gestion des simulateurs",
  INTERACTIONS: "Gestion des interactions",
  COMMENTS: "Gestion des commentaires",
  DASHBOARD: "Tableau de bord",
};