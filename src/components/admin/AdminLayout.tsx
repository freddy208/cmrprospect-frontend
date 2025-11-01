/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/admin/AdminLayout.tsx
"use client";

import { useEffect } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { useAdminContext } from "@/hooks/useAdminContext";
import { User } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const { setActiveSection } = useAdminContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}