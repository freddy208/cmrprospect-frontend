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

export function ProspectFilters({ onFilterChange }: ProspectFiltersProps) {
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    serviceType: "",
    leadChannel: "",
    assignedToId: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: "",
      type: "",
      serviceType: "",
      leadChannel: "",
      assignedToId: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

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
            <SelectItem value="">Tous les statuts</SelectItem>
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
            <SelectItem value="">Tous les types</SelectItem>
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
            <SelectItem value="">Tous les types</SelectItem>
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
            <SelectItem value="">Tous les canaux</SelectItem>
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