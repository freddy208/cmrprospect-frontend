/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/users/UserEditDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CreateUserData, UpdateUserData } from "@/types/user";
import { USER_STATUS, ROLES } from "@/lib/constants";
import { toast } from "sonner";
import countries from "world-countries";
import { ArrowLeft, ArrowRight, Save, Eye, EyeOff, RefreshCw } from "lucide-react";

interface UserEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
  currentUser: any;
}

export function UserEditDialog({ isOpen, onClose, user, onSubmit, currentUser }: UserEditDialogProps) {
  const [formData, setFormData] = useState<CreateUserData | UpdateUserData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: "",
    country: "",
    isActive: true,
    status: "ACTIVE"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState("general");

  // Trier les pays par nom
  const sortedCountries = countries
    .map(country => ({
      name: country.name.common,
      code: country.cca2
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName,
        roleId: user.roleId,
        country: user.country || "",
        isActive: user.isActive,
        status: user.status,
        password: "" // Ne pas pré-remplir le mot de passe
      });
    } else {
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        roleId: "",
        country: "",
        isActive: true,
        status: "ACTIVE"
      });
    }
    setErrors({});
    setCurrentTab("general");
  }, [user, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ lors de la modification
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email est invalide";
    }

    if (!user && !formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Le rôle est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      toast.success(user ? "Utilisateur mis à jour avec succès" : "Utilisateur créé avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error(error?.response?.data?.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange("password", password);
    setShowPassword(true);
  };

  const nextTab = () => {
    if (currentTab === "general") setCurrentTab("security");
  };

  const prevTab = () => {
    if (currentTab === "security") setCurrentTab("general");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ color: "#171717" }}>
                  {user ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="general">Informations générales</TabsTrigger>
                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <Card className="border-gray-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: "#1D4ED8" }}>
                          Informations personnelles
                        </CardTitle>
                        <CardDescription>
                          Informations de base de l&apos;utilisateur
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName || ""}
                              onChange={(e) => handleChange("firstName", e.target.value)}
                              placeholder="Prénom"
                              className="focus:border-blue-600 focus:ring-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Nom *</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName || ""}
                              onChange={(e) => handleChange("lastName", e.target.value)}
                              placeholder="Nom"
                              className={`focus:border-blue-600 focus:ring-blue-600 ${errors.lastName ? "border-red-500" : ""}`}
                            />
                            {errors.lastName && (
                              <p className="text-sm text-red-500">{errors.lastName}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Email"
                            className={`focus:border-blue-600 focus:ring-blue-600 ${errors.email ? "border-red-500" : ""}`}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Pays</Label>
                          <Select
                            value={formData.country || ""}
                            onValueChange={(value) => handleChange("country", value)}
                            disabled={currentUser?.role?.name === "COUNTRY_MANAGER"}
                          >
                            <SelectTrigger className="focus:border-blue-600 focus:ring-blue-600">
                              <SelectValue placeholder="Sélectionner un pays" />
                            </SelectTrigger>
                            <SelectContent>
                              {sortedCountries.map((country) => (
                                <SelectItem key={country.code} value={country.name}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: "#1D4ED8" }}>
                          Rôle et permissions
                        </CardTitle>
                        <CardDescription>
                          Définir le rôle de l&apos;utilisateur
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="roleId">Rôle *</Label>
                          <Select
                            value={formData.roleId || ""}
                            onValueChange={(value) => handleChange("roleId", value)}
                          >
                            <SelectTrigger className={`focus:border-blue-600 focus:ring-blue-600 ${errors.roleId ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ROLES).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.roleId && (
                            <p className="text-sm text-red-500">{errors.roleId}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    <Card className="border-gray-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: "#1D4ED8" }}>
                          Mot de passe
                        </CardTitle>
                        <CardDescription>
                          {user
                            ? "Laissez vide pour conserver le mot de passe actuel"
                            : "Définir un mot de passe pour l'utilisateur"
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password">
                              Mot de passe {!user && "*"}
                            </Label>
                            {!user && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={generateRandomPassword}
                                className="flex items-center gap-1"
                              >
                                <RefreshCw className="h-3 w-3" />
                                Générer
                              </Button>
                            )}
                          </div>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password || ""}
                              onChange={(e) => handleChange("password", e.target.value)}
                              placeholder="Mot de passe"
                              className={`focus:border-blue-600 focus:ring-blue-600 pr-10 ${errors.password ? "border-red-500" : ""}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg" style={{ color: "#1D4ED8" }}>
                          Statut du compte
                        </CardTitle>
                        <CardDescription>
                          Gérer le statut du compte de l&apos;utilisateur
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="isActive">Compte actif</Label>
                            <p className="text-sm text-gray-500">
                              Un compte inactif ne peut pas se connecter
                            </p>
                          </div>
                          <Switch
                            id="isActive"
                            checked={formData.isActive || false}
                            onCheckedChange={(checked) => handleChange("isActive", checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status">Statut</Label>
                          <Select
                            value={formData.status || "ACTIVE"}
                            onValueChange={(value) => handleChange("status", value)}
                          >
                            <SelectTrigger className="focus:border-blue-600 focus:ring-blue-600">
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(USER_STATUS).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between mt-6">
                  <div>
                    {currentTab === "security" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevTab}
                        className="flex items-center gap-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Annuler
                    </Button>
                    {currentTab === "general" ? (
                      <Button
                        type="button"
                        onClick={nextTab}
                        className="flex items-center gap-1"
                        style={{ backgroundColor: "#1D4ED8" }}
                      >
                        Suivant
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevTab}
                          className="flex items-center gap-1"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Précédent
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          style={{ backgroundColor: "#1D4ED8" }}
                          className="flex items-center gap-1"
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? "Enregistrement..." : (user ? "Mettre à jour" : "Créer")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}