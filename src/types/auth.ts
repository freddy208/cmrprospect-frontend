// src/types/auth.ts
export type UserRole = "DIRECTEUR_GENERAL" | "COUNTRY_MANAGER" | "SALES_OFFICER";

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
  country?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  // tokens sont dans cookies httpOnly (accessToken + refreshToken)
};
