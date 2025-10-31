// src/components/prospects/prospect-grid.tsx
"use client";

import { motion } from "framer-motion";
import { ProspectCard, ProspectCardSkeleton } from "./prospect-card";
import { Prospect } from "@/types/prospect";

interface ProspectGridProps {
  prospects: Prospect[];
  isLoading: boolean;
}

export function ProspectGrid({ prospects, isLoading }: ProspectGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <ProspectCardSkeleton />
          </motion.div>
        ))}
      </div>
    );
  }

  if (!prospects || prospects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#F3F4F6" }}>
          <span className="text-2xl" style={{ color: "#1D4ED8" }}>📋</span>
        </div>
        <h3 className="text-lg font-medium mb-1" style={{ color: "#171717" }}>Aucun prospect trouvé</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Essayez d&apos;ajuster vos filtres ou de créer un nouveau prospect pour commencer.
        </p>
        <button 
          className="mt-4 px-4 py-2 rounded-md text-white text-sm font-medium"
          style={{ backgroundColor: "#1D4ED8" }}
          onClick={() => window.location.href = "/prospects/create"}
        >
          Créer un prospect
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {prospects.map((prospect, index) => (
        <motion.div
          key={prospect.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          layout
        >
          <ProspectCard prospect={prospect} />
        </motion.div>
      ))}
    </motion.div>
  );
}