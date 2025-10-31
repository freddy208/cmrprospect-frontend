/* eslint-disable @typescript-eslint/no-explicit-any */
 
// src/app/(dashboard)/prospects/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { CreateProspectForm } from "@/components/prospects/create-prospect-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCreateProspect } from "@/hooks/use-create-prospect";
import { CreateProspectData } from "@/types/prospect";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateProspectPage() {
  const router = useRouter();
  const { mutateAsync: createProspect, isPending } = useCreateProspect();

  const handleCreate = async (data: CreateProspectData) => {
    try {
      await createProspect(data);
      toast.success("Prospect créé avec succès !");
      router.push("/prospects");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de la création.");
    }
  };

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
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full" style={{ backgroundColor: "#EBF5FF" }}>
              <UserPlus className="h-6 w-6" style={{ color: "#1D4ED8" }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
              Créer un nouveau prospect
            </h1>
            <Sparkles className="h-5 w-5" style={{ color: "#FBBF24" }} />
          </div>
          <p className="text-gray-600">
            Remplissez les informations ci-dessous pour ajouter un nouveau prospect à votre base de données.
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
            <span className="text-sm font-medium" style={{ color: "#FBBF24" }}>
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
            <div className="h-2"  />
            <CardContent className="p-6 md:p-8">
              <CreateProspectForm onSubmit={handleCreate} isSubmitting={isPending} />
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
                    Plus vous fournissez d&apos;informations précises sur votre prospect, plus il sera facile de le contacter et de le convertir en client.
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