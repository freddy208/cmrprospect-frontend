// src/lib/auth.ts
import api from "@/lib/api";
import type { LoginPayload } from "@/types/auth";

export async function login(payload: LoginPayload) {
  return api.post("/auth/login", payload);
}

export async function logout() {
  return api.post("/auth/logout");
}

export async function me() {
  return api.get("/auth/me");
}
