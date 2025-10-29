/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { IUser, ICreateUser, IUpdateUser } from "@/types/user";
import { ROLE_LABEL } from "@/lib/constants";
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Globe,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import countries from "world-countries";


interface UserFormProps {
  user?: IUser;
  onSubmit: (data: ICreateUser | IUpdateUser) => Promise<void>;
  isLoading?: boolean;
  mode: "create" | "edit";
  currentUserEmail?: string; // Email de l'utilisateur connecté
}

export default function UserForm({
  user,
  onSubmit,
  isLoading,
  mode,
  currentUserEmail,
}: UserFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const formattedCountries = countries.map((country: { name: { common: any; }; cca2: any; }) => ({
  name: country.name.common,
  code: country.cca2,
}));


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ICreateUser | IUpdateUser>({
    defaultValues: user
      ? {
          email: user.email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: user.role,
          country: user.country || "",
          isActive: user.isActive,
        }
      : {
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "SALES_OFFICER",
          country: "CM",
        },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRole = watch("role");
  const isActive = watch("isActive");

  const canEditPassword =
    mode === "edit" && user && currentUserEmail === user.email;

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Erreur", {
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Erreur", {
        description: "Le mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }

    setValue("password", newPassword);
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Mot de passe mis à jour", {
      description: "Le nouveau mot de passe sera enregistré lors de la sauvegarde.",
    });
  };

  const onFormSubmit = async (data: any) => {
    try {
      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Erreur", {
          description: "Veuillez entrer une adresse email valide.",
        });
        return;
      }

      // Validation mot de passe pour création
      if (mode === "create" && (!data.password || data.password.length < 8)) {
        toast.error("Erreur", {
          description: "Le mot de passe doit contenir au moins 8 caractères.",
        });
        return;
      }

      // Validation nom requis
      if (!data.lastName || data.lastName.trim() === "") {
        toast.error("Erreur", {
          description: "Le nom est requis.",
        });
        return;
      }

      await onSubmit(data);
    } catch (error: any) {
      toast.error("Erreur", {
        description:
          error?.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/users")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "create" ? "Créer un utilisateur" : "Modifier l'utilisateur"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "create"
              ? "Ajoutez un nouveau membre à votre équipe"
              : "Mettez à jour les informations de l'utilisateur"}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                Informations de l&apos;utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="utilisateur@entreprise.com"
                    {...register("email", { required: true })}
                    disabled={mode === "edit"}
                    className={`h-11 ${
                      errors ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors && (
                    <p className="text-sm text-red-600">L&apos;email est requis</p>
                  )}
                </div>

                {/* Prénom et Nom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      {...register("firstName")}
                      className="h-11 border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      {...register("lastName", { required: true })}
                      className={`h-11 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">Le nom est requis</p>
                    )}
                  </div>
                </div>

                {/* Rôle */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-gray-500" />
                    Rôle *
                  </Label>
                  <Select
                    value={selectedRole as string}
                    onValueChange={(value: any) =>
                      setValue("role", value as any)
                    }
                  >
                    <SelectTrigger className="h-11 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABEL).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pays */}
                {/* Pays */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    Pays *
                  </Label>
                  <Select
                    value={(watch("country") as string) || ""}
                    onValueChange={(value: string) => setValue("country", value)}
                  >
                    <SelectTrigger className="h-11 border-gray-300">
                      <SelectValue placeholder="Choisissez un pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {formattedCountries.map((country: { code: any; name: any; }) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                {/* Mot de passe (création uniquement) */}
                {mode === "create" && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-gray-500" />
                      Mot de passe *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password", { required: mode === "create" })}
                        className={`h-11 pr-10 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">
                        Le mot de passe est requis (min. 8 caractères)
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Minimum 8 caractères
                    </p>
                  </div>
                )}

                {/* Bouton modifier mot de passe (édition, utilisateur connecté uniquement) */}
                {mode === "edit" && canEditPassword && (
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-gray-500" />
                      Mot de passe
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full h-11"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Modifier mon mot de passe
                    </Button>
                  </div>
                )}

                {/* Statut actif (édition uniquement) */}
                {mode === "edit" && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive" className="text-base">
                        Utilisateur actif
                      </Label>
                      <p className="text-sm text-gray-500">
                        Autoriser cet utilisateur à se connecter
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={isActive as boolean}
                      onCheckedChange={(checked: boolean | undefined) => setValue("isActive", checked)}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/users")}
                    className="flex-1 h-11"
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {mode === "create" ? "Créer" : "Enregistrer"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal changement mot de passe */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier mon mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre nouveau mot de passe. Il doit contenir au moins 8
              caractères.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false);
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePasswordChange}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!newPassword || !confirmPassword}
            >
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}