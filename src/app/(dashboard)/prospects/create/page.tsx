/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/prospects/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { CreateProspectForm } from "@/components/prospects/create-prospect-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCreateProspect } from "@/hooks/use-create-prospect";
// --- CORRECTION : Importer le type manquant ---
import { CreateProspectData } from "@/types/prospect";

export default function CreateProspectPage() {
  const router = useRouter();
  const { mutateAsync: createProspect, isPending } = useCreateProspect();

  const handleCreate = async (data: CreateProspectData) => {
    try {
      await createProspect(data);
      toast.success("Prospect créé avec succès !");
      router.push("/prospects");
    } catch (error: any) { // Bonne pratique de typer l'erreur
      toast.error(error.message || "Une erreur est survenue lors de la création.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      {/* --- CORRECTION : Suppression du Card imbriqué --- */}
      <Card>
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <CardTitle>Créer un nouveau prospect</CardTitle>
        </CardHeader>
        <CardContent>
          {/* --- CORRECTION : Ajouter la prop isSubmitting --- */}
          <CreateProspectForm onSubmit={handleCreate} isSubmitting={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}