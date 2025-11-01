/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/profile/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserEditDialog } from "@/components/users/UserEditDialog";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { getById, update } = useUsers();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      try {
        const userData = await getById(params.id as string);
        setUser(userData);
        setIsEditOpen(true);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.id, getById]);

  const handleUpdateUser = async (data: any) => {
    if (!user) return;
    try {
      await update(user.id, data);
      setUser({ ...user, ...data });
      setIsEditOpen(false);
      router.push(`/users/profile/${params.id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    }
  };

  const handleClose = () => {
    if (user) {
      setIsEditOpen(false);
      router.push(`/users/profile/${params.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Utilisateur non trouvé.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="space-y-6" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push(`/profile/${params.id}`)}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au profil
          </Button>
          <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
            {isOwnProfile ? "Modifier mon profil" : `Modifier le profil de ${user.firstName} ${user.lastName}`}
          </h1>
        </div>

        <UserEditDialog
          isOpen={isEditOpen}
          onClose={handleClose}
          user={user}
          onSubmit={handleUpdateUser}
          currentUser={currentUser}
        />
      </motion.div>

      {/* Bouton pour remonter en haut */}
      <ScrollToTop />
    </div>
  );
}