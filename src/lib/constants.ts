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

export const STATUS = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  QUALIFIED: "Qualifié",
  CLOSED: "Clos",
};
