/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/update-prospect-form.tsx
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
import { PROSPECT_TYPE, PROSPECT_TYPE_LABEL, PROSPECT_STATUS_LABEL, SERVICE_TYPE_LABEL, LEAD_CHANNEL_LABEL } from "@/lib/constants";
import countries from "world-countries";
import { Prospect, UpdateProspectData } from "@/types/prospect";
import { Formation } from "@/types/formation";
import { Simulateur } from "@/types/simulateur";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Globe, Briefcase, MessageSquare, Building, UserPlus, UserCheck, CreditCard, MapPin, Edit, AlertCircle, Loader2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getFormations } from "@/lib/api";
import { getSimulateurs } from "@/lib/api";

interface UpdateProspectFormProps {
  prospect: Prospect;
  onSubmit: (data: UpdateProspectData) => void;
  isSubmitting: boolean;
}

export function UpdateProspectForm({ prospect, onSubmit, isSubmitting }: UpdateProspectFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [simulateurs, setSimulateurs] = useState<Simulateur[]>([]);
  const [isLoadingFormations, setIsLoadingFormations] = useState(false);
  const [isLoadingSimulateurs, setIsLoadingSimulateurs] = useState(false);
  const [formationsError, setFormationsError] = useState<string | null>(null);
  const [simulateursError, setSimulateursError] = useState<string | null>(null);
  const [formationPopoverOpen, setFormationPopoverOpen] = useState(false);
  const [simulateurPopoverOpen, setSimulateurPopoverOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { users, isLoading: isLoadingUsers } = useUsers({ autoFetch: true });
  
  const form = useForm<UpdateProspectData>({
    defaultValues: {
      type: prospect.type,
      email: prospect.email,
      phone: prospect.phone,
      country: prospect.country,
      leadChannel: prospect.leadChannel as any,
      serviceType: prospect.serviceType,
      assignedToId: prospect.assignedTo?.id || "",
      initialComment: "",
      firstName: prospect.firstName || "",
      lastName: prospect.lastName || "",
      companyName: prospect.companyName || "",
      contactFirstName: prospect.contactFirstName || "",
      contactLastName: prospect.contactLastName || "",
      whatsapp: prospect.whatsapp || "",
      status: prospect.status,
      formationId: prospect.formation?.id || "",
      simulateurId: prospect.simulateur?.id || "",
    },
  });

  // Watch for type changes to reset specific fields
  const prospectType = useWatch({ control: form.control, name: "type" });
  const serviceType = useWatch({ control: form.control, name: "serviceType" });
  const selectedFormationId = useWatch({ control: form.control, name: "formationId" });
  const selectedSimulateurId = useWatch({ control: form.control, name: "simulateurId" });
  
  // Fetch formations when serviceType changes to FORMATION
  useEffect(() => {
    if (serviceType === "FORMATION") {
      setIsLoadingFormations(true);
      setFormationsError(null);
      
      getFormations()
        .then((data) => {
          setFormations(data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des formations:", error);
          setFormationsError("Impossible de charger les formations");
        })
        .finally(() => {
          setIsLoadingFormations(false);
        });
    }
  }, [serviceType]);

  // Fetch simulateurs when serviceType changes to SIMULATEUR
  useEffect(() => {
    if (serviceType === "SIMULATEUR") {
      setIsLoadingSimulateurs(true);
      setSimulateursError(null);
      
      getSimulateurs()
        .then((data) => {
          setSimulateurs(data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des simulateurs:", error);
          setSimulateursError("Impossible de charger les simulateurs");
        })
        .finally(() => {
          setIsLoadingSimulateurs(false);
        });
    }
  }, [serviceType]);

  // Reset formation/simulateur when service type changes
  useEffect(() => {
    if (serviceType === "FORMATION") {
      form.setValue("simulateurId", "");
    } else if (serviceType === "SIMULATEUR") {
      form.setValue("formationId", "");
    }
  }, [serviceType, form]);
  
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
    const cleanedData: UpdateProspectData = {
      type: data.type,
      email: data.email,
      phone: data.phone,
      country: data.country,
      leadChannel: data.leadChannel,
      serviceType: data.serviceType,
      assignedToId: data.assignedToId || undefined,
      initialComment: data.initialComment || undefined,
      whatsapp: data.whatsapp || undefined,
      status: data.status,
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

    // Ajouter l'ID de la formation ou du simulateur si applicable
    if (data.serviceType === "FORMATION" && data.formationId) {
      cleanedData.formationId = data.formationId;
    } else if (data.serviceType === "SIMULATEUR" && data.simulateurId) {
      cleanedData.simulateurId = data.simulateurId;
    }

    onSubmit(cleanedData);
  });

  // Helper pour trouver le nom de la formation sélectionnée
  const getSelectedFormationName = () => {
    if (!selectedFormationId) return "Sélectionner une formation";
    const formation = formations.find(f => f.id === selectedFormationId);
    return formation ? formation.name : "Formation non trouvée";
  };

  // Helper pour trouver le nom du simulateur sélectionné
  const getSelectedSimulateurName = () => {
    if (!selectedSimulateurId) return "Sélectionner un simulateur";
    const simulateur = simulateurs.find(s => s.id === selectedSimulateurId);
    return simulateur ? simulateur.name : "Simulateur non trouvé";
  };

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

          {/* Status Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                  <Briefcase className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                  Statut et informations sur le service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    rules={{ required: "Le statut est obligatoire" }}
                    render={({ field }) => (
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <FormItem>
                          <FormLabel className="text-gray-700">Statut *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Sélectionner un statut" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PROSPECT_STATUS_LABEL).map(([key, label]) => (
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

          {/* Formation/Simulateur Section */}
          <AnimatePresence>
            {serviceType === "FORMATION" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                      <Briefcase className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                      Formation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingFormations ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Chargement des formations...</span>
                      </div>
                    ) : formationsError ? (
                      <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>{formationsError}</span>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="formationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Formation</FormLabel>
                            <Popover open={formationPopoverOpen} onOpenChange={setFormationPopoverOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {getSelectedFormationName()}
                                    <Briefcase className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <ScrollArea className="h-72">
                                  <div className="p-1">
                                    {formations.length === 0 ? (
                                      <div className="py-6 text-center text-sm text-gray-500">
                                        Aucune formation disponible
                                      </div>
                                    ) : (
                                      formations.map((formation) => (
                                        <div
                                          key={formation.id}
                                          className={cn(
                                            "relative flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                            field.value === formation.id && "bg-accent text-accent-foreground"
                                          )}
                                          onClick={() => {
                                            field.onChange(formation.id);
                                            setFormationPopoverOpen(false);
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">{formation.name}</span>
                                            <span className="text-xs text-gray-500">
                                              {formation.country} - {formation.price}€
                                            </span>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </ScrollArea>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {serviceType === "SIMULATEUR" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                      <CreditCard className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                      Simulateur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingSimulateurs ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Chargement des simulateurs...</span>
                      </div>
                    ) : simulateursError ? (
                      <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>{simulateursError}</span>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="simulateurId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Simulateur</FormLabel>
                            <Popover open={simulateurPopoverOpen} onOpenChange={setSimulateurPopoverOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {getSelectedSimulateurName()}
                                    <CreditCard className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <ScrollArea className="h-72">
                                  <div className="p-1">
                                    {simulateurs.length === 0 ? (
                                      <div className="py-6 text-center text-sm text-gray-500">
                                        Aucun simulateur disponible
                                      </div>
                                    ) : (
                                      simulateurs.map((simulateur) => (
                                        <div
                                          key={simulateur.id}
                                          className={cn(
                                            "relative flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                            field.value === simulateur.id && "bg-accent text-accent-foreground"
                                          )}
                                          onClick={() => {
                                            field.onChange(simulateur.id);
                                            setSimulateurPopoverOpen(false);
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">{simulateur.name}</span>
                                            <span className="text-xs text-gray-500">
                                              {simulateur.country} - {simulateur.monthlyPrice}€/mois
                                            </span>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </ScrollArea>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comments Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
                        <FormLabel className="text-gray-700">Commentaire de mise à jour</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ajouter un commentaire sur cette mise à jour..."
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
            transition={{ duration: 0.5, delay: 0.7 }}
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
                    Mise à jour en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Mettre à jour le prospect
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