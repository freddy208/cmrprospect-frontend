// src/types/auth.ts
import { Role } from "./role";

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  roleId: string;
  role: Role;
  country?: string | null;
  isActive: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  // tokens sont dans cookies httpOnly (accessToken + refreshToken)
};