// src/components/prospects/view-toggle.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center p-1 rounded-md" style={{ backgroundColor: "#F3F4F6" }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("grid")}
        className={cn(
          "h-8 w-8 p-0",
          view === "grid" && "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("table")}
        className={cn(
          "h-8 w-8 p-0",
          view === "table" && "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}