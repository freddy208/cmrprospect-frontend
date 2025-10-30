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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg: xl:grid-cols-4 gap-4"
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