"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/user";
import { ROLE_LABEL } from "@/lib/constants";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserCardProps {
  user: IUser;
  onDelete: (user: IUser) => void;
}

export default function UserCard({ user, onDelete }: UserCardProps) {
  const router = useRouter();

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive || status === "INACTIVE") {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          Inactif
        </Badge>
      );
    }
    if (status === "DELETED") {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-700">
          Supprimé
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-700">
        Actif
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      DIRECTEUR_GENERAL: "bg-yellow-100 text-yellow-700 border-yellow-200",
      COUNTRY_MANAGER: "bg-purple-100 text-purple-700 border-purple-200",
      SALES_OFFICER: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <Badge variant="outline" className={colors[role] || ""}>
        {ROLE_LABEL[role] || role}
      </Badge>
    );
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
        <CardContent className="p-6">
          {/* Header avec dropdown */}
          <div className="flex items-start justify-between mb-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
              {getInitials(user.firstName, user.lastName)}
            </div>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  aria-label="Actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/users/${user.id}/edit`)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(user)}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Informations utilisateur */}
          <div className="space-y-3">
            {/* Nom */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {user.firstName || user.lastName
                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                  : "Sans nom"}
              </h3>
            </div>

            {/* Email */}
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
              <span className="truncate">{user.email}</span>
            </div>

            {/* Pays */}
            {user.country && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                <span>{user.country}</span>
              </div>
            )}

            {/* Date de création */}
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
              <span>
                Créé le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.status, user.isActive)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}