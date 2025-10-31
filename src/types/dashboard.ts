// src/types/dashboard.ts

// Type pour le filtre, doit correspondre au DashboardFilterDto du backend
export type DashboardFilter = {
  startDate?: string; // Format ISO 8601
  endDate?: string;   // Format ISO 8601
};

// Type pour un "Top Sales Officer" renvoyé par le backend
export type TopSalesOfficer = {
  id: string;
  firstName?: string | null;
  role?: string;
  lastName?: string | null;
  prospectCount: number;
};

// Type pour un "Top Country Manager" renvoyé par le backend
export type TopCountryManager = {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  countryName: string; // Nouveau champ
  country: string;
  prospectCount: number;
};

// Type pour les données groupées (ex: par pays, par statut)
// src/types/dashboard.ts

// ... (le reste du fichier est identique)

// Type pour les données groupées (ex: par pays, par statut)
// --- CORRECTION CRUCIALE ---
// On contraint T pour qu'il soit toujours un type de clé d'objet valide (string)
// Type pour les données groupées (ex: par pays, par statut)
export type GroupedData<T extends string = string> = {
  [key in T]: number | { _count: { id: number } }; // Permet les deux formats possibles
};

// --- Types pour les statistiques de chaque rôle ---

export type DashboardStatsDG = {
  totalProspects: number;
  prospectsByCountry: GroupedData; // Devient GroupedData<string>
  prospectsByStatus: GroupedData<keyof (typeof import('@/lib/constants').PROSPECT_STATUS)>; // Fonctionne car les clés sont des string
  topSalesOfficers: TopSalesOfficer[];
  topCountryManagers: TopCountryManager[];
  totalConversions: number;
  conversionRate: number;
  activeUsers: number;
  prospectsByType: GroupedData; // Devient GroupedData<string>
};

// ... (le reste du fichier est identique)

export type DashboardStatsCM = {
  totalProspects: number;
  prospectsByStatus: GroupedData<keyof (typeof import('@/lib/constants').PROSPECT_STATUS)>;
  topSalesOfficers: TopSalesOfficer[];
  totalConversions: number;
  conversionRate: number;
  prospectsByType: GroupedData;
};

export type DashboardStatsSO = {
  totalProspects: number;
  prospectsByStatus: GroupedData<keyof (typeof import('@/lib/constants').PROSPECT_STATUS)>;
  totalConversions: number;
  conversionRate: number;
  prospectsByType: GroupedData;
};

// Type principal qui est une union des trois, pour une flexibilité maximale 
export type DashboardStats = DashboardStatsDG | DashboardStatsCM | DashboardStatsSO;