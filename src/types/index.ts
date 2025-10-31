// src/types/index.ts

export type Interaction = {
  id: string;
  type?: string | null;
  channel?: string | null;
  notes: string;
  duration?: number | null;
  createdAt: string;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
};

// src/types/index.ts

// ... (imports existants)
export type { 
  Formation, 
  CreateFormationData, 
  UpdateFormationData, 
  FormationFilter,
  FormationStatsByCountry,
  FormationStatsByManager,
  FormationProspectStats
} from './formation';

// src/types/index.ts

// ... (imports existants)
export type { 
  Simulateur, 
  CreateSimulateurData, 
  UpdateSimulateurData, 
  SimulateurFilter,
  SimulateurStatsByCountry,
  SimulateurStatsByManager,
  SimulateurProspectStats
} from './simulateur';

export type { Comment, CreateCommentData, UpdateCommentData, CommentFilter } from './comment';