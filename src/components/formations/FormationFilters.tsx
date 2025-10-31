/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/formations/FormationFilters.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FormationFilter } from "@/types/formation";
import { FORMATION_STATUS } from "@/lib/constants";
import countries from "world-countries";

interface FormationFiltersProps {
  filters: FormationFilter;
  onFilter: (filters: FormationFilter) => void;
  currentUser: any;
}

export function FormationFilters({ filters, onFilter, currentUser }: FormationFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FormationFilter>(filters);

  // Trier les pays par nom
  const sortedCountries = useMemo(() => {
    return countries
      .map(country => ({
        name: country.name.common,
        code: country.cca2
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

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
    onFilter(resetFilters);
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Recherche</label>
            <Input
              placeholder="Nom de la formation"
              value={localFilters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Pays</label>
            <Select
              value={localFilters.country || ""}
              onValueChange={(value) => handleFilterChange("country", value)}
              disabled={currentUser?.role?.name === "COUNTRY_MANAGER"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les pays</SelectItem>
                {sortedCountries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Statut</label>
            <Select
              value={localFilters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                {Object.entries(FORMATION_STATUS).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}