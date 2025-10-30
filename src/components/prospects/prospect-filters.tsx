/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/prospect-filters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import {
  PROSPECT_STATUS,
  PROSPECT_STATUS_LABEL,
  SERVICE_TYPE_LABEL,
  LEAD_CHANNEL_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProspectFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function ProspectFilters({ onFilterChange }: ProspectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
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
      search: "",
      status: "",
      serviceType: "",
      leadChannel: "",
      assignedToId: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, email, entreprise..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filtres
        {activeFilterCount > 0 && (
          <span className="ml-2 rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 border rounded-md p-4 bg-background"
        >
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium">Statut</label>
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

          {/* Service Type Filter */}
          <div>
            <label className="text-sm font-medium">Type de Service</label>
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
            <label className="text-sm font-medium">Canal d&apos;Acquisition</label>
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
          <Button variant="ghost" onClick={clearFilters} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Effacer les filtres
          </Button>
        </motion.div>
      )}
    </div>
  );
}