/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/prospects/edit/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useProspect } from "@/hooks/useProspect";
import { UpdateProspectForm } from "@/components/prospects/update-prospect-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useMutateUpdateProspect } from "@/hooks/use-update-prospect";
import { Card, CardContent } from "@/components/ui/card";

export default function EditProspectPage() {
  const params = useParams();
  const id = params.id as string;

  const { prospect, isLoading, error } = useProspect(id);
  const { mutateAsync: updateProspect, isPending } = useMutateUpdateProspect(id);

  const handleUpdate = async (data: any) => {
    try {
      await updateProspect(data);
      toast.success("Prospect mis à jour avec succès !");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de la mise à jour.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium" style={{ color: "#171717" }}>Chargement du prospect...</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez patienter pendant que nous récupérons les informations.</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FEE2E2" }}>
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#171717" }}>Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            style={{ backgroundColor: "#1D4ED8" }}
            className="text-white"
          >
            Réessayer
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FEF3C7" }}>
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#171717" }}>Prospect non trouvé</h2>
          <p className="text-gray-600 mb-6">Le prospect que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <Button
            onClick={() => window.location.href = "/prospects"}
            style={{ backgroundColor: "#1D4ED8" }}
            className="text-white"
          >
            Retour à la liste
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: "#F9FAFB" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#EBF5FF" }}>
              <Edit className="h-6 w-6" style={{ color: "#1D4ED8" }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
              Modifier le prospect
            </h1>
            <Sparkles className="h-5 w-5" style={{ color: "#FBBF24" }} />
          </div>
          <p className="text-gray-600">
            Mettez à jour les informations du prospect ci-dessous.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "#171717" }}>
              Progression
            </span>
            <span className="text-sm font-medium" style={{ color: "#1D4ED8" }}>
              Étape 1 sur 1
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: "#1D4ED8" }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <UpdateProspectForm
                prospect={prospect}
                onSubmit={handleUpdate}
                isSubmitting={isPending}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-100 mt-1">
                  <Sparkles className="h-4 w-4" style={{ color: "#1D4ED8" }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "#1D4ED8" }}>
                    Conseil
                  </h3>
                  <p className="text-sm text-gray-700">
                    Assurez-vous de mettre à jour les informations importantes du prospect pour un suivi efficace.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}