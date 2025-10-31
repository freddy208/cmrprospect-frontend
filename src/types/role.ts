// src/types/role.ts
export type Role = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: {
    id: string;
    name: string;
    description?: string | null;
  }[];
  _count: {
    users: number;
  };
};

export type CreateRoleData = {
  name: string;
  description?: string;
  permissionIds: string[];
};

export type UpdateRoleData = Partial<Omit<CreateRoleData, 'permissionIds'>> & {
  permissionIds?: string[];
};

export type RoleFilter = {
  search?: string;
};