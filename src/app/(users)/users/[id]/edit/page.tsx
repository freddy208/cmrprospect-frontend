/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useParams } from "next/navigation";
import { useUser, useUpdateUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import UserForm from "@/components/users/UserForm";
import { IUpdateUser } from "@/types/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, isError } = useUser(userId);
  const updateUserMutation = useUpdateUser();
  const { user: currentUser } = useAuth();

  const handleSubmit = async (data: IUpdateUser) => {
    // Vérification permission pour mot de passe
    if (data.password && currentUser?.email !== user?.email) {
      toast.error("Permission refusée", {
        description: "Vous n'avez pas le droit de modifier le mot de passe d'un autre utilisateur.",
      });
      return Promise.reject(new Error("Permission denied"));
    }

    return new Promise<void>((resolve, reject) => {
      updateUserMutation.mutate(
        { id: userId, data },
        {
          onSuccess: () => {
            toast.success("Utilisateur mis à jour", {
              description: `${data.firstName} ${data.lastName} a été mis à jour avec succès.`,
            });
            router.push(`/users/${userId}`);
            resolve();
          },
          onError: (error: any) => {
            toast.error("Erreur de mise à jour", {
              description:
                error?.response?.data?.message ||
                "Impossible de mettre à jour cet utilisateur.",
            });
            reject(error);
          },
        }
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Utilisateur introuvable
          </h2>
          <p className="text-gray-600 mb-4">
            Cet utilisateur n&apos;existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => router.push("/users")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <UserForm
      mode="edit"
      user={user}
      onSubmit={handleSubmit}
      isLoading={updateUserMutation.isPending}
      currentUserEmail={currentUser?.email}
    />
  );
}