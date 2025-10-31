/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/prospect-filters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import {
  PROSPECT_STATUS,
  PROSPECT_STATUS_LABEL,
  SERVICE_TYPE_LABEL,
  LEAD_CHANNEL_LABEL,
  PROSPECT_TYPE_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProspectFiltersProps {
  onFilterChange: (filters: any) => void;
}

// Définir un type pour l'état des filtres pour plus de clarté
type FilterState = {
  status: string;
  type: string;
  serviceType: string;
  leadChannel: string;
  assignedToId: string;
};

export function ProspectFilters({ onFilterChange }: ProspectFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    type: "all",
    serviceType: "all",
    leadChannel: "all",
    assignedToId: "all",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // SOLUTION : Créer un objet avec uniquement les filtres actifs (différents de "all")
    // On utilise `reduce` pour construire un nouvel objet propre
    const activeFilters = (Object.keys(newFilters) as Array<keyof FilterState>).reduce((acc, k) => {
      // Si la valeur n'est pas "all", on l'ajoute à l'accumulateur
      if (newFilters[k] !== "all") {
        acc[k] = newFilters[k];
      }
      return acc;
    }, {} as Partial<FilterState>); // `Partial` rend toutes les propriétés de FilterState optionnelles
    
    onFilterChange(activeFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      status: "all",
      type: "all",
      serviceType: "all",
      leadChannel: "all",
      assignedToId: "all",
    };
    setFilters(emptyFilters);
    onFilterChange({}); // On passe un objet vide pour réinitialiser tous les filtres
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== "all").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium mb-1 block">Statut</label>
        <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(PROSPECT_STATUS_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div>
        <label className="text-sm font-medium mb-1 block">Type</label>
        <Select value={filters.type} onValueChange={(v) => handleFilterChange("type", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(PROSPECT_TYPE_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Service Type Filter */}
      <div>
        <label className="text-sm font-medium mb-1 block">Type de Service</label>
        <Select value={filters.serviceType} onValueChange={(v) => handleFilterChange("serviceType", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(SERVICE_TYPE_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lead Channel Filter */}
      <div>
        <label className="text-sm font-medium mb-1 block">Canal d&apos;Acquisition</label>
        <Select value={filters.leadChannel} onValueChange={(v) => handleFilterChange("leadChannel", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les canaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les canaux</SelectItem>
            {Object.entries(LEAD_CHANNEL_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      <div className="flex items-end">
        <Button 
          variant="outline" 
          onClick={clearFilters} 
          className="w-full"
          disabled={activeFilterCount === 0}
          style={{ borderColor: "#1D4ED8", color: "#1D4ED8" }}
        >
          <X className="mr-2 h-4 w-4" />
          Effacer
        </Button>
      </div>
    </div>
  );
}