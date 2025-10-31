// src/components/admin/AdminLayout.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Key, 
  Settings, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePermissionsCheck } from "@/hooks/usePermissionsCheck";
import { useAdminContext } from "@/hooks/useAdminContext";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    permission: "dashboard:read"
  },
  {
    id: "users",
    label: "Utilisateurs",
    icon: Users,
    permission: "users:read"
  },
  {
    id: "roles",
    label: "Rôles",
    icon: Shield,
    permission: "roles:read"
  },
  {
    id: "permissions",
    label: "Permissions",
    icon: Key,
    permission: "permissions:read"
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    permission: "settings:read"
  }
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissionsCheck();
  const { activeSection, setActiveSection } = useAdminContext();
  const router = useRouter();

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    router.push(`/administration/${sectionId}`);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const filteredNavigationItems = navigationItems.filter(item => 
    hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar pour mobile */}
      <motion.div
        className="fixed inset-0 z-50 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setSidebarOpen(false)}
      >
        <div className={cn(
          "absolute inset-0 bg-gray-900 transition-opacity",
          sidebarOpen ? "opacity-50" : "opacity-0"
        )} />
      </motion.div>

      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Administration</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.firstName?.charAt(0) || user?.email.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email
                }
              </p>
              <p className="text-xs text-gray-500">
                {user?.role?.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold text-gray-900">
            {navigationItems.find(item => item.id === activeSection)?.label}
          </h1>
        </div>

        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}