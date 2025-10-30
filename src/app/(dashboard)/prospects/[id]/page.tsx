// src/app/(dashboard)/prospects/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useProspect } from "@/hooks/useProspect";
import { ProspectDetailTabs } from "@/components/prospects/prospect-detail-tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProspectDetailPage() {
  const { id } = useParams() as { id: string };
  const { prospect, isLoading, error } = useProspect(id);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error || !prospect) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/prospects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {prospect.firstName} {prospect.lastName}
        </h1>
      </div>

      {/* Main Content */}
      <ProspectDetailTabs prospect={prospect} />
    </motion.div>
  );
}