// src/types/user.ts
export type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName: string;
  roleId: string;
  role: {
    id: string;
    name: string;
    description?: string | null;
    permissions: {
      id: string;
      name: string;
      description?: string | null;
    }[];
  };
  country?: string | null;
  isActive: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
};

export type CreateUserData = {
  email: string;
  password: string;
  firstName?: string;
  lastName: string;
  roleId: string;
  country?: string;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED';
};

export type UpdateUserData = Partial<Omit<CreateUserData, 'password'>> & {
  password?: string;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED';
};

export type UserFilter = {
  search?: string;
  roleId?: string;
  country?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  isActive?: boolean;
  sortBy?: 'createdAt' | 'lastLogin' | 'firstName' | 'lastName' | 'email';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};