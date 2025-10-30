/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/prospects/edit/[id]/page.tsx  (vérifiez que le chemin du fichier est correct)
"use client";

import { useParams } from "next/navigation"; // <-- CORRECTION : Importer depuis next/navigation
import { useProspect } from "@/hooks/useProspect"; // Ce hook doit exister et récupérer un prospect par ID
import { UpdateProspectForm } from "@/components/prospects/update-prospect-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useMutateUpdateProspect } from "@/hooks/use-update-prospect"; // <-- Importer le hook de mutation

export default function EditProspectPage() {
  const params = useParams(); // useParams retourne un objet
  const id = params.id as string; // Récupérer l'ID et le typer

  const { prospect, isLoading, error } = useProspect(id);
  const { mutateAsync: updateProspect, isPending } = useMutateUpdateProspect(id); // <-- Utiliser le hook de mutation

  const handleUpdate = async (data: any) => { // Remplacez 'any' par 'UpdateProspectData' si possible
    await updateProspect(data);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!prospect) {
    return <div>Prospect non trouvé.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-2xl p-6"
    >
      <Card>
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <CardTitle>Modifier le prospect</CardTitle>
        </CardHeader>
        <CardContent>
          {/* CORRECTION : Connecter le formulaire à la logique de mise à jour */}
          <UpdateProspectForm
            prospect={prospect}
            onSubmit={handleUpdate}
            isSubmitting={isPending}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}