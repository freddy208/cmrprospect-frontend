// src/components/prospects/row-actions.tsx

import { RowActionsProps } from "@/types/prospect";
import { toast } from "sonner";
import Link from "next/link"; // <--- CORRECTION 1 : Import par défaut
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function RowActions({ prospect }: RowActionsProps) {
  const handleDelete = () => {
    toast("Fonctionnalité non implémentée.");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* CORRECTION 2 : Utilisation de `asChild` pour un HTML propre */}
        <DropdownMenuItem asChild>
          <Link href={`/prospects/${prospect.id}/edit`}>Modifier</Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}