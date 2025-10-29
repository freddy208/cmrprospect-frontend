/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useCreateUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import UserForm from "@/components/users/UserForm";
import { ICreateUser, IUpdateUser } from "@/types/user";
import { toast } from "sonner";

export default function CreateUserPage() {
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const { user: currentUser } = useAuth();

  const handleSubmit = async (data: ICreateUser) => {
    return new Promise<void>((resolve, reject) => {
      createUserMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Utilisateur créé", {
            description: `${data.firstName} ${data.lastName} a été créé avec succès.`,
          });
          router.push("/users");
          resolve();
        },
        onError: (error: any) => {
          toast.error("Erreur de création", {
            description:
              error?.response?.data?.message ||
              "Impossible de créer cet utilisateur.",
          });
          reject(error);
        },
      });
    });
  };

  return (
<UserForm
  mode="create"
  onSubmit={handleSubmit as (data: ICreateUser | IUpdateUser) => Promise<void>} // ✅ Cast explicite
  isLoading={createUserMutation.isPending}
  currentUserEmail={currentUser?.email}
/>
  );
}