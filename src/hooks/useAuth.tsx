/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
      console.log('🟢 ==================== FETCH ME ====================');
      console.log('🟢 Appel à /auth/me...');
      
      const res = await api.get("/auth/me");
      
      console.log('🟢 Réponse /auth/me:', res);
      console.log('🟢 res.data:', res.data);
      console.log('🟢 res.status:', res.status);
      console.log('🟢 res.headers:', res.headers);
      
      const userData = res.data?.user ?? res.data ?? null;
      console.log('🟢 User extrait:', userData);
      
      return userData;
    } catch (err: any) {
      console.error('❌ Erreur fetchMe:', err);
      console.error('❌ Status:', err?.response?.status);
      console.error('❌ Message:', err?.message);
      return null;
    }
  };

  // try refresh token
  const refresh = async (): Promise<boolean> => {
    try {
      console.log('🟡 ==================== REFRESH ====================');
      console.log('🟡 Tentative de refresh...');
      
      await api.post("/auth/refresh");
      
      console.log('✅ Refresh réussi');
      
      const me = await fetchMe();
      if (me) {
        setUser(me);
        console.log('✅ User mis à jour après refresh');
        return true;
      }
      
      console.log('❌ Pas de user après refresh');
      return false;
    } catch (err: any) {
      console.error('❌ Erreur refresh:', err);
      console.error('❌ Status:', err?.response?.status);
      setUser(null);
      return false;
    }
  };

  // ✅ login that returns true/false
  const login = async (payload: LoginPayload): Promise<boolean> => {
    setLoading(true);
    
    try {
      console.log('🔵 ==================== LOGIN FRONTEND ====================');
      console.log('🔵 Email:', payload.email);
      console.log('🔵 API URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('🔵 Tentative de connexion...');
      
      const res = await api.post("/auth/login", payload);
      
      console.log('🔵 Réponse login:', res);
      console.log('🔵 Status:', res.status);
      console.log('🔵 Headers:', res.headers);
      console.log('🔵 Data brute:', res.data);
      
      const u = res.data?.user ?? res.data;
      console.log('🔵 User extrait:', u);
      
      if (u) {
        setUser(u);
        console.log('✅ User défini dans le state:', u.email);
        console.log('✅ Login réussi');
        return true;
      }

      console.log('❌ Pas de user dans la réponse');
      return false;
    } catch (error: any) {
      console.error("❌ ==================== ERREUR LOGIN ====================");
      console.error("❌ Error:", error);
      console.error("❌ Response:", error?.response);
      console.error("❌ Status:", error?.response?.status);
      console.error("❌ Data:", error?.response?.data);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
      console.log('🔵 ==================== FIN LOGIN ====================');
    }
  };

  const logout = async () => {
    try {
      console.log('🔴 ==================== LOGOUT ====================');
      await api.post("/auth/logout");
      console.log('✅ Logout réussi');
    } catch (err) {
      console.error('❌ Erreur logout:', err);
    } finally {
      setUser(null);
      console.log('🔴 User supprimé du state');
    }
  };

  // Fetch /auth/me au montage
  useEffect(() => {
    let mounted = true;
    
    (async () => {
      console.log('⚡ ==================== INITIALISATION AUTH ====================');
      console.log('⚡ Vérification de la session...');
      
      setLoading(true);
      const me = await fetchMe();
      
      if (me) {
        if (mounted) {
          setUser(me);
          console.log('✅ Session trouvée, user:', me.email);
        }
        setLoading(false);
        return;
      }
      
      console.log('⚠️ Pas de session, tentative de refresh...');
      const ok = await refresh();
      
      if (!ok && mounted) {
        setUser(null);
        console.log('❌ Refresh échoué, pas de session');
      }
      
      setLoading(false);
      console.log('⚡ ==================== FIN INITIALISATION ====================');
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // refresh périodique
  useEffect(() => {
    console.log('⏰ Timer de refresh périodique activé (toutes les 10 min)');
    
    const id = setInterval(() => {
      console.log('⏰ Refresh périodique déclenché');
      refresh().catch(() => {});
    }, 10 * 60 * 1000);
    
    return () => {
      console.log('⏰ Timer de refresh désactivé');
      clearInterval(id);
    };
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