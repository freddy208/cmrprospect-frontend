/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/create-prospect-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROSPECT_TYPE, PROSPECT_TYPE_LABEL, SERVICE_TYPE_LABEL, LEAD_CHANNEL_LABEL } from "@/lib/constants";
import countries from "world-countries";
import { CreateProspectData } from "@/types/prospect";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Globe, Briefcase, MessageSquare, Building, UserPlus, UserCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CreateProspectFormProps {
  onSubmit: (data: CreateProspectData) => void;
  isSubmitting: boolean;
}

export function CreateProspectForm({ onSubmit: onSubmitProp, isSubmitting }: CreateProspectFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const { users, isLoading: isLoadingUsers } = useUsers({ autoFetch: true });
  
  const form = useForm<CreateProspectData>({
    defaultValues: {
      type: "PARTICULIER",
      email: "",
      phone: "",
      country: "",
      leadChannel: "EMAIL",
      serviceType: "FORMATION",
      assignedToId: "",
      initialComment: "",
      firstName: "",
      lastName: "",
      companyName: "",
      contactFirstName: "",
      contactLastName: "",
      whatsapp: "",
    },
  });

  // Watch for type changes to reset specific fields
  const prospectType = useWatch({ control: form.control, name: "type" });
  
  useEffect(() => {
    if (prospectType === "PARTICULIER") {
      form.setValue("companyName", "");
      form.setValue("contactFirstName", "");
      form.setValue("contactLastName", "");
    } else if (prospectType === "ENTREPRISE") {
      form.setValue("firstName", "");
      form.setValue("lastName", "");
    }
  }, [prospectType, form]);

  const handleFormSubmit = form.handleSubmit((data) => {
    // Nettoyer les données avant de les envoyer
    const cleanedData: CreateProspectData = {
      type: data.type,
      email: data.email,
      phone: data.phone,
      country: data.country,
      leadChannel: data.leadChannel,
      serviceType: data.serviceType,
      assignedToId: data.assignedToId || undefined,
      initialComment: data.initialComment || undefined,
      whatsapp: data.whatsapp || undefined,
    };

    // Ajouter les champs spécifiques selon le type
    if (data.type === "PARTICULIER") {
      cleanedData.firstName = data.firstName;
      cleanedData.lastName = data.lastName;
    } else if (data.type === "ENTREPRISE") {
      cleanedData.companyName = data.companyName;
      cleanedData.contactFirstName = data.contactFirstName;
      cleanedData.contactLastName = data.contactLastName;
    }

    // Valider que les champs obligatoires sont remplis
    if (data.type === "PARTICULIER" && (!data.firstName || !data.lastName)) {
      form.setError("firstName", { message: "Le prénom est obligatoire pour un particulier" });
      form.setError("lastName", { message: "Le nom est obligatoire pour un particulier" });
      return;
    }

    if (data.type === "ENTREPRISE" && !data.companyName) {
      form.setError("companyName", { message: "Le nom de l'entreprise est obligatoire" });
      return;
    }

    onSubmitProp(cleanedData);
  });

  // Filtrer les utilisateurs selon le rôle de l'utilisateur connecté
  const getFilteredUsers = () => {
    if (!currentUser) return [];
    
    // Si l'utilisateur est un DIRECTEUR_GENERAL, il peut voir tous les utilisateurs
    if (currentUser.role.name === "DIRECTEUR_GENERAL") {
      return users;
    }
    
    // Si l'utilisateur est un COUNTRY_MANAGER, il ne peut voir que les utilisateurs de son pays
    if (currentUser.role.name === "COUNTRY_MANAGER") {
      return users.filter(user => 
        user.country === currentUser.country || 
        user.role.name === "DIRECTEUR_GENERAL"
      );
    }
    
    // Si l'utilisateur est un SALES_OFFICER, il ne peut s'assigner des prospects qu'à lui-même
    if (currentUser.role.name === "SALES_OFFICER") {
      return users.filter(user => user.id === currentUser.id);
    }
    
    return users;
  };

  const filteredUsers = getFilteredUsers();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Prospect Type Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <Building className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Type de prospect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-4">
                          {Object.entries(PROSPECT_TYPE_LABEL).map(([key, label]) => (
                            <motion.div
                              key={key}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                type="button"
                                variant={field.value === key ? "default" : "outline"}
                                className={cn(
                                  "flex-1 h-12",
                                  field.value === key
                                    ? key === "PARTICULIER" 
                                      ? "bg-indigo-600 text-white border-indigo-600" 
                                      : "bg-emerald-600 text-white border-emerald-600"
                                    : "border-gray-300 text-gray-700 hover:border-blue-400"
                                )}
                                onClick={() => field.onChange(key)}
                              >
                                {label}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <User className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "L'email est obligatoire" }}
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4" />
                            Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jean.dupont@example.com"
                              {...field}
                              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              onFocus={() => setFocusedField("email")}
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Le téléphone est obligatoire" }}
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700">
                            <Phone className="h-4 w-4" />
                            Téléphone *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+225 555 1234"
                              {...field}
                              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              onFocus={() => setFocusedField("phone")}
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700">
                            <Phone className="h-4 w-4" />
                            WhatsApp (optionnel)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+225 555 1234"
                              {...field}
                              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              onFocus={() => setFocusedField("whatsapp")}
                              onBlur={() => setFocusedField(null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    rules={{ required: "Le pays est obligatoire" }}
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700">
                            <Globe className="h-4 w-4" />
                            Pays *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {countries.map((country) => (
                                <SelectItem key={country.cca2} value={country.name.common}>
                                  {country.name.common}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specific Information Section - Particulier */}
          <AnimatePresence>
            {prospectType === "PARTICULIER" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                      <UserCheck className="h-5 w-5" style={{ color: "#6366F1" }} />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        rules={{ required: "Le prénom est obligatoire pour un particulier" }}
                        render={({ field }) => (
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-gray-700">
                                <User className="h-4 w-4" />
                                Prénom *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Jean"
                                  {...field}
                                  className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  onFocus={() => setFocusedField("firstName")}
                                  onBlur={() => setFocusedField(null)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </motion.div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        rules={{ required: "Le nom est obligatoire pour un particulier" }}
                        render={({ field }) => (
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-gray-700">
                                <User className="h-4 w-4" />
                                Nom *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Dupont"
                                  {...field}
                                  className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  onFocus={() => setFocusedField("lastName")}
                                  onBlur={() => setFocusedField(null)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </motion.div>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Specific Information Section - Entreprise */}
          <AnimatePresence>
            {prospectType === "ENTREPRISE" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                      <Building className="h-5 w-5" style={{ color: "#10B981" }} />
                      Informations de l&apos;entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        rules={{ required: "Le nom de l'entreprise est obligatoire" }}
                        render={({ field }) => (
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-gray-700">
                                <Building className="h-4 w-4" />
                                Nom de l&apos;entreprise *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Entreprise ABC"
                                  {...field}
                                  className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                  onFocus={() => setFocusedField("companyName")}
                                  onBlur={() => setFocusedField(null)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </motion.div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactFirstName"
                        render={({ field }) => (
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-gray-700">
                                <UserCheck className="h-4 w-4" />
                                Prénom du contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Jean"
                                  {...field}
                                  className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                  onFocus={() => setFocusedField("contactFirstName")}
                                  onBlur={() => setFocusedField(null)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </motion.div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactLastName"
                        render={({ field }) => (
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-gray-700">
                                <UserCheck className="h-4 w-4" />
                                Nom du contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Dupont"
                                  {...field}
                                  className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                  onFocus={() => setFocusedField("contactLastName")}
                                  onBlur={() => setFocusedField(null)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </motion.div>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Service Information Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <Briefcase className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Informations sur le service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    rules={{ required: "Le type de service est obligatoire" }}
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="text-gray-700">Type de Service *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Sélectionner un type de service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(SERVICE_TYPE_LABEL).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leadChannel"
                    rules={{ required: "Le canal d'acquisition est obligatoire" }}
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="text-gray-700">Canal d&apos;acquisition *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Sélectionner un canal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(LEAD_CHANNEL_LABEL).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assignedToId"
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700">
                            <Users className="h-4 w-4" />
                            Assigné à
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Assigner à un utilisateur" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingUsers ? (
                                <div className="flex items-center justify-center py-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                  <span>Chargement...</span>
                                </div>
                              ) : filteredUsers.length === 0 ? (
                                <div className="py-2 text-center text-sm text-gray-500">
                                  Aucun utilisateur disponible
                                </div>
                              ) : (
                                filteredUsers.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    <div className="flex items-center gap-2">
                                      <span>{user.firstName} {user.lastName}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {user.role.name}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </motion.div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <MessageSquare className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Commentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="initialComment"
                  render={({ field }) => (
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <FormItem>
                        <FormLabel className="text-gray-700">Commentaire initial</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ajouter un commentaire initial..."
                            {...field}
                            className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                            onFocus={() => setFocusedField("initialComment")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-end"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="px-8 py-3 text-base font-medium h-12"
                style={{ backgroundColor: "#1D4ED8" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Créer le prospect
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}