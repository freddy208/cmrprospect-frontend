/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type SortField = "name" | "email" | "createdAt";
type SortOrder = "asc" | "desc";

// ✅ Déclaré en dehors du composant principal
function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField;
  sortField: SortField;
  sortOrder: SortOrder;
}) {
  if (sortField !== field) {
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  }
  return sortOrder === "asc" ? (
    <ArrowUp className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" />
  );
}

interface UsersTableProps {
  users: IUser[];
  onDelete: (user: IUser) => void;
}

export default function UsersTable({ users, onDelete }: UsersTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "name":
        aValue = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
        bValue = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
        break;
      case "email":
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

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
    return <Badge className="bg-green-100 text-green-700">Actif</Badge>;
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
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[60px]">Avatar</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="h-8 px-2 hover:bg-gray-100">
                  Nom complet
                  <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("email")} className="h-8 px-2 hover:bg-gray-100">
                  Email
                  <SortIcon field="email" sortField={sortField} sortOrder={sortOrder} />
                </Button>
              </TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("createdAt")} className="h-8 px-2 hover:bg-gray-100">
                  Date création
                  <SortIcon field="createdAt" sortField={sortField} sortOrder={sortOrder} />
                </Button>
              </TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "Sans nom"}
                </TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell className="text-gray-600">{user.country || "-"}</TableCell>
                <TableCell>{getStatusBadge(user.status, user.isActive)}</TableCell>
                <TableCell className="text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Actions">
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
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
