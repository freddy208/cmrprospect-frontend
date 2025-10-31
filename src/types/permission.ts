// src/types/permission.ts
export type Permission = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
};

export type PermissionFilter = {
  search?: string;
};