/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/resource-section.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, GraduationCap, Calculator, DollarSign, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResourceSectionProps {
  type: "formation" | "simulateur";
  resource: any;
  prospectId: string;
}

export function ResourceSection({ type, resource, prospectId }: ResourceSectionProps) {
  if (!resource) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
              {type === "formation" ? (
                <GraduationCap className="h-5 w-5" style={{ color: "#1D4ED8" }} />
              ) : (
                <Calculator className="h-5 w-5" style={{ color: "#1D4ED8" }} />
              )}
              {type === "formation" ? "Formation" : "Simulateur"}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#F3F4F6" }}>
                {type === "formation" ? (
                  <GraduationCap className="h-8 w-8" style={{ color: "#1D4ED8" }} />
                ) : (
                  <Calculator className="h-8 w-8" style={{ color: "#1D4ED8" }} />
                )}
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: "#171717" }}>
                Aucun(e) {type === "formation" ? "formation" : "simulateur"} associé(e)
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Ce prospect n&apos;a pas encore de {type === "formation" ? "formation" : "simulateur"} associé.
              </p>
              <Link href={`/prospects/${prospectId}/edit`}>
                <Button style={{ backgroundColor: "#1D4ED8" }} className="text-white">
                  Associer un(e) {type === "formation" ? "formation" : "simulateur"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between" style={{ color: "#171717" }}>
            <div className="flex items-center gap-2">
              {type === "formation" ? (
                <GraduationCap className="h-5 w-5" style={{ color: "#1D4ED8" }} />
              ) : (
                <Calculator className="h-5 w-5" style={{ color: "#1D4ED8" }} />
              )}
              {type === "formation" ? "Formation" : "Simulateur"}
            </div>
            <div className="flex items-center gap-2">
              {resource.price && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {resource.price}
                </Badge>
              )}
              {resource.monthlyPrice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {resource.monthlyPrice}/mois
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg" style={{ color: "#171717" }}>{resource.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
          </div>

          {resource.country && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Pays: {resource.country}</span>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <Link
              href={type === "formation" ? `/formations/${resource.id}` : `/simulateurs/${resource.id}`}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Voir les détails <ExternalLink size={14} />
            </Link>
            <Link href={`/prospects/${prospectId}/edit`}>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}