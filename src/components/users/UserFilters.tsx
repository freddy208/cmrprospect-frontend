"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Download, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { IUserFilter } from "@/types/user";
import { ROLES, ROLE_LABEL, USER_STATUS } from "@/lib/constants";

interface UserFiltersProps {
  filters: IUserFilter;
  onFiltersChange: (filters: IUserFilter) => void;
  onExportCSV?: () => void;
}

export default function UserFilters({
  filters,
  onFiltersChange,
  onExportCSV,
}: UserFiltersProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleRoleChange = (value: string) => {
    onFiltersChange({
      ...filters,
      role: value === "all" ? undefined : (value as any),
    });
  };

  const handleCountryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      country: value === "all" ? undefined : value,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : value,
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search || filters.role || filters.country || filters.status;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Recherche */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher par nom, email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 h-11 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Filtre par rôle */}
        <Select
          value={filters.role || "all"}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="w-full lg:w-48 h-11 border-gray-300">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {Object.entries(ROLE_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par pays */}
        <Select
          value={filters.country || "all"}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="w-full lg:w-48 h-11 border-gray-300">
            <SelectValue placeholder="Tous les pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            <SelectItem value="CM">Cameroun</SelectItem>
            <SelectItem value="CI">Côte d'Ivoire</SelectItem>
            <SelectItem value="SN">Sénégal</SelectItem>
            <SelectItem value="BJ">Bénin</SelectItem>
            <SelectItem value="TG">Togo</SelectItem>
            <SelectItem value="GH">Ghana</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtre par statut */}
        <Select
          value={filters.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full lg:w-48 h-11 border-gray-300">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(USER_STATUS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-9"
            >
              <X className="w-4 h-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {onExportCSV && (
            <Button
              variant="outline"
              onClick={onExportCSV}
              className="flex-1 sm:flex-none h-11"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
          <Button
            onClick={() => router.push("/users/create")}
            className="flex-1 sm:flex-none h-11 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau utilisateur
          </Button>
        </div>
      </div>
    </div>
  );
}