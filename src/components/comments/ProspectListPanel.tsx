// src/app/(dashboard)/comments/components/ProspectListPanel.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getProspects } from "@/lib/api";
import { Prospect } from "@/types/prospect";
import { cn } from "@/lib/utils";

interface ProspectListPanelProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function ProspectListPanel({ onSelect, selectedId }: ProspectListPanelProps) {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const data = await getProspects();
        setProspects(data);
      } catch (error) {
        console.error("Failed to fetch prospects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProspects();
  }, []);

  const filteredProspects = useMemo(() => {
    return prospects.filter(prospect =>
      prospect.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [prospects, searchTerm]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#171717" }}>Prospects</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un prospect..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <AnimatePresence>
          {isLoading ? (
            [...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full mb-2 rounded-md" />)
          ) : (
            filteredProspects.map((prospect) => (
            <motion.div
              key={prospect.id}
              layoutId={`prospect-${prospect.id}`}
              onClick={() => onSelect(prospect.id)}
              className={cn(
                "p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3",
                selectedId === prospect.id ? "bg-blue-50 border-l-4" : "hover:bg-gray-100"
              )}
              style={{ borderLeftColor: selectedId === prospect.id ? "#1D4ED8" : "transparent" }}
            >
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#EBF5FF" }}
              >
                <User className="h-5 w-5" style={{ color: "#1D4ED8" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#171717" }}>
                  {prospect.type === "ENTREPRISE" ? prospect.companyName : `${prospect.firstName} ${prospect.lastName}`}
                </p>
                <p className="text-xs text-gray-500 truncate">{prospect.email}</p>
              </div>
            </motion.div>

            ))
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}