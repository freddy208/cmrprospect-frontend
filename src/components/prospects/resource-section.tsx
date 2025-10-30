/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface ResourceSectionProps {
  type: "formation" | "simulateur";
  resource: any;
  prospectId: string;
}

export function ResourceSection({ type, resource, prospectId }: ResourceSectionProps) {
  if (!resource) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{type === "formation" ? "Formation" : "Simulateur"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun(e) {type === "formation" ? "formation" : "simulateur"} associé(e).
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{type === "formation" ? "Formation" : "Simulateur"}</span>
          <Badge variant="secondary">{resource.price ? `${resource.price}€` : "N/A"}</Badge>
        </CardTitle> {/* ✅ Fermeture CardTitle */}
      </CardHeader> {/* ✅ Fermeture CardHeader */}

      <CardContent className="space-y-2">
        <h4 className="font-semibold">{resource.name}</h4>
        <p className="text-sm text-muted-foreground">{resource.description}</p>

        {resource.country && (
          <p className="text-xs text-muted-foreground">Pays: {resource.country}</p>
        )}

        <div className="pt-2">
          <Link
            href={type === "formation" ? `/formations/${resource.id}` : `/simulateurs/${resource.id}`}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            Voir les détails <ExternalLink size={14} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
