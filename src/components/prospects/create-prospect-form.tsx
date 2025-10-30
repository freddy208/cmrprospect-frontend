/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/create-prospect-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, // <-- CORRECTION : Importer FormLabel
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PROSPECT_TYPE, PROSPECT_TYPE_LABEL } from "@/lib/constants";
import countries from "world-countries";
import { CreateProspectData } from "@/types/prospect";
import { cn } from "@/lib/utils";

interface CreateProspectFormProps {
  onSubmit: (data: CreateProspectData) => void;
  isSubmitting: boolean;
}

export function CreateProspectForm({ onSubmit: onSubmitProp, isSubmitting }: CreateProspectFormProps) {
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
    },
  });

  // CORRECTION : Créer une fonction de soumission qui utilise handleSubmit de react-hook-form
  const handleFormSubmit = form.handleSubmit(onSubmitProp);

  return (
    // CORRECTION : Connecter la soumission du formulaire ici
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            // CORRECTION : La structure correcte est control={form.control} et name="..."
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Prospect</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PARTICULIER">Particulier</SelectItem>
                    <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem> // <-- CORRECTION : Ajouter la balise de fermeture manquante
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+225 555 1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.cca2} value={country.cca2}>
                        {country.name.common}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem> // <-- CORRECTION : Ajouter la balise de fermeture manquante
            )}
          />
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Service</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FORMATION">Formation</SelectItem>
                    <SelectItem value="SIMULATEUR">Simulateur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem> // <-- CORRECTION : Ajouter la balise de fermeture manquante
            )}
          />
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigné à</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Assigner à un utilisateur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Ici, vous devrez implémenter la logique pour lister les utilisateurs selon le rôle de l'utilisateur connecté */}
                    {/* TODO: Fetch users based on user role */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem> // <-- CORRECTION : Ajouter la balise de fermeture manquante
            )}
          />
        </div>

        {/* Initial Comment */}
        <FormField
          control={form.control}
          name="initialComment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaire initial</FormLabel>
              <FormControl>
                <Textarea placeholder="Ajouter un commentaire initial..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Création en cours..." : "Créer le prospect"}
        </Button>
      </form> 
    </Form>
  );
}