// src/types/prospect.ts

// Type pour le filtre, doit correspondre au FilterProspectDto du backend
export type ProspectFilter = {
  search?: string;
  country?: string;
  status?: keyof (typeof import('@/lib/constants').PROSPECT_STATUS);
  serviceType?: 'SIMULATEUR' | 'FORMATION';
  leadChannel?: keyof (typeof import('@/lib/constants').LEAD_CHANNEL);
  assignedToId?: string;
  type?: 'PARTICULIER' | 'ENTREPRISE';
};

// Type pour la création d'un prospect
export type CreateProspectData = {
  email: string;
  country: string;
  phone: string;
  whatsapp?: string;
  leadChannel: keyof (typeof import('@/lib/constants').LEAD_CHANNEL);
  serviceType: 'SIMULATEUR' | 'FORMATION';
  type: 'PARTICULIER' | 'ENTREPRISE';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  formationId?: string;
  simulateurId?: string;
  assignedToId?: string;
  initialComment?: string;
};

// Type pour la mise à jour d'un prospect
export type UpdateProspectData = Partial<CreateProspectData> & {
  // On ajoute les champs spécifiques à la mise à jour
  status: Prospect['status']; // Le type doit correspondre exactement à celui de Prospect
};

// Type pour un utilisateur associé à un prospect
export type AssignedUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  role: {
    name: string;
  };
};

// Type pour une formation ou un simulateur associé
export type AssociatedResource = {
  id: string;
  name: string;
  price?: number;
  monthlyPrice?: number;
};

// Type principal pour un Prospect complet
export type Prospect = {
  id: string;
  type: 'PARTICULIER' | 'ENTREPRISE';
  email: string;
  country: string;
  phone: string;
  whatsapp?: string | null;
  leadChannel: string;
  serviceType: 'SIMULATEUR' | 'FORMATION';
  status: keyof (typeof import('@/lib/constants').PROSPECT_STATUS);
  genericStatus: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  nextCallDate?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  contactFirstName?: string | null;
  contactLastName?: string | null;
  createdAt: string;
  updatedAt: string;
  convertedAt?: string | null;
  _count: {
    comments: number;
    interactions: number;
  };
  assignedTo: AssignedUser | null;
  createdBy: AssignedUser;
  formation: AssociatedResource | null;
  simulateur: AssociatedResource | null;
};

export type RowActionsProps = {
  prospect: Prospect;
};