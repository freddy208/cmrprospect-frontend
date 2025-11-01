// src/components/layout/top-bar.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User,  LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewProfile = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`);
    }
  };

  const handleEditProfile = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}/edit`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center space-x-3">
        <Sparkles className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-900">ProspectsHub</span>
      </Link>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white">
                {user ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Voir mon profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Modifier mon profil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}