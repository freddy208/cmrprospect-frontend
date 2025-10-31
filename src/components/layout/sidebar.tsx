// src/components/layout/sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageSquare,
  CheckCircle,
  Users2,
  GraduationCap,
  Calculator,
  Shield,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ROLE_LABEL } from "@/lib/constants";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Prospects Particuliers", href: "/prospects/", icon: Users },
  { name: "Prospects Entreprises", href: "/prospects/entreprises", icon: Users2 },
  { name: "Interactions", href: "/dashboard/interactions", icon: MessageSquare },
  { name: "Prospects Aboutis", href: "/prospects/aboutis", icon: CheckCircle },
  { name: "Équipes", href: "/equipes", icon: UserCheck },
  { name: "Formations", href: "/formations", icon: GraduationCap },
  { name: "Simulateur", href: "/simulateur", icon: Calculator },
  { name: "Gestion des droits", href: "/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn("flex flex-col bg-blue-700 text-white transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      {/* User Info */}
      <div className="flex h-16 items-center justify-center border-b border-blue-600 p-4">
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-blue-200">Bienvenue, {ROLE_LABEL[user?.role as keyof typeof ROLE_LABEL]}</p>
          </div>
        )}
      </div>

      {/* Navigation url*/}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-600 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isCollapsed && "mx-auto")} />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-blue-600">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-blue-100 hover:bg-blue-600 hover:text-white"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Réduire</span>}
        </Button>
      </div>
    </div>
  );
}