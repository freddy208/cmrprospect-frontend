/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useAuth.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";
import type { AuthUser, LoginPayload } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch current user (backend should expose GET /auth/me)
  const fetchMe = async (): Promise<AuthUser | null> => {
    try {
      const res = await api.get("/auth/me");
      return res.data?.user ?? res.data ?? null;
    } catch (err) {
      return null;
    }
  };

  // try refresh token
  const refresh = async (): Promise<boolean> => {
    try {
      await api.post("/auth/refresh");
      const me = await fetchMe();
      if (me) {
        setUser(me);
        return true;
      }
      return false;
    } catch (err) {
      setUser(null);
      return false;
    }
  };

  // ✅ login that returns true/false
  const login = async (payload: LoginPayload): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", payload);
      const u = res.data?.user ?? res.data;

      if (u) {
        setUser(u);
        return true; // ✅ succès
      }

      return false; // échec
    } catch (error) {
      console.error("Erreur login:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  // Fetch /auth/me au montage
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const me = await fetchMe();
      if (me) {
        if (mounted) setUser(me);
        setLoading(false);
        return;
      }
      const ok = await refresh();
      if (!ok && mounted) setUser(null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // refresh périodique
  useEffect(() => {
    const id = setInterval(() => {
      refresh().catch(() => {});
    }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    refresh,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
