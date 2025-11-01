/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/users/UserFilters.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { UserFilter } from "@/types/user";
import { USER_STATUS, ROLES } from "@/lib/constants";
import countries from "world-countries";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown, Search, Filter, X } from "lucide-react";

interface UserFiltersProps {
  filters: UserFilter;
  onFilter: (filters: UserFilter) => void;
  currentUser: any;
  isOpen: boolean;
  onToggle: () => void;
}

export function UserFilters({ filters, onFilter, currentUser, isOpen, onToggle }: UserFiltersProps) {
  const [localFilters, setLocalFilters] = useState<UserFilter>(filters);
  const [countrySearch, setCountrySearch] = useState("");

  // Trier les pays par nom
  const sortedCountries = useMemo(() => {
    return countries
      .map(country => ({
        name: country.name.common,
        code: country.cca2
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filtrer les pays selon la recherche
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return sortedCountries;
    return sortedCountries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch, sortedCountries]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters = currentUser?.role?.name === "COUNTRY_MANAGER"
      ? { country: currentUser.country }
      : {};
    setLocalFilters(resetFilters);
    setCountrySearch("");
    onFilter(resetFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof UserFilter];
    return value !== undefined && value !== "" && value !== null;
  });

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onToggle}
            className="flex items-center gap-2"
            style={{ borderColor: "#1D4ED8", color: "#1D4ED8" }}
          >
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {Object.keys(localFilters).filter(key => {
                  const value = localFilters[key as keyof UserFilter];
                  return value !== undefined && value !== "" && value !== null;
                }).length}
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Nom, prénom ou email"
                      value={localFilters.search || ""}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rôle</label>
                  <Select
                    value={localFilters.roleId || "all"}
                    onValueChange={(value) => handleFilterChange("roleId", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      {Object.entries(ROLES).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pays</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                        disabled={currentUser?.role?.name === "COUNTRY_MANAGER"}
                      >
                        {localFilters.country || "all" ? (
                          sortedCountries.find(c => c.name === localFilters.country)?.name || "Sélectionner un pays"
                        ) : "Sélectionner un pays"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher un pays..."
                          value={countrySearch}
                          onValueChange={setCountrySearch}
                        />
                        <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          <CommandItem
                            value="all"
                            onSelect={() => {
                              handleFilterChange("country", "");
                              setCountrySearch("");
                            }}
                          >
                            Tous les pays
                          </CommandItem>
                          {filteredCountries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.name}
                              onSelect={() => {
                                handleFilterChange("country", country.name);
                                setCountrySearch("");
                              }}
                            >
                              {country.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <Select
                    value={localFilters.status || "all"}
                    onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {Object.entries(USER_STATUS).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}