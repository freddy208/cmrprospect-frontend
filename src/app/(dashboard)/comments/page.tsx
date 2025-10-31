// src/app/(dashboard)/comments/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProspectListPanel } from "@/components/comments/ProspectListPanel";
import { CommentViewPanel } from "@/components/comments/CommentViewPanel";
import { cn } from "@/lib/utils";

export default function CommentsPage() {
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-5rem)] overflow-hidden"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      {/* Panneau de gauche : Liste des prospects */}
      <div className={cn(
        "w-full md:w-1/3 lg:w-1/4 border-r border-gray-200",
        selectedProspectId && "hidden md:block"
      )}>
        <ProspectListPanel onSelect={setSelectedProspectId} selectedId={selectedProspectId} />
      </div>

      {/* Panneau de droite : Détails des commentaires */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedProspectId && "hidden md:flex"
      )}>
        {selectedProspectId ? (
          <CommentViewPanel 
            prospectId={selectedProspectId} 
            onBack={() => setSelectedProspectId(null)} 
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Sélectionnez un prospect pour voir ses commentaires.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}