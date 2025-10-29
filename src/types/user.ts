// src/types/user.ts
export type UserRole = "DIRECTEUR_GENERAL" | "COUNTRY_MANAGER" | "SALES_OFFICER";

export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  country?: string;
  isActive: boolean;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserFilter {
  search?: string;
  role?: UserRole;
  country?: string;
  status?: string;
}

export interface ICreateUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  country?: string;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  country?: string;
  password?: string;
  isActive?: boolean;
}
