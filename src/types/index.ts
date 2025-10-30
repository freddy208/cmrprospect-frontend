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

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
};