/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

interface FormationFiltersProps {
  filters: FormationFilter;
  onFilter: (filters: FormationFilter) => void;
  currentUser: any;
}

export function FormationFilters({ filters, onFilter, currentUser }: FormationFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FormationFilter>(filters);
  const [countrySearch, setCountrySearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");

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

  // Filtrer les statuts selon la recherche
  const filteredStatuses = useMemo(() => {
    if (!statusSearch) return Object.entries(FORMATION_STATUS);
    return Object.entries(FORMATION_STATUS).filter(([key, value]) => 
      value.toLowerCase().includes(statusSearch.toLowerCase())
    );
  }, [statusSearch]);

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
    setStatusSearch("");
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