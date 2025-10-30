// src/components/prospects/update-prospect-form.tsx
"use client";

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
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import {  PROSPECT_STATUS_LABEL } from "@/lib/constants";
import { Prospect } from "@/types/prospect";
import { UpdateProspectData } from "@/types/prospect"; // <-- CORRECTION : Importer le type

// L'interface était déjà correcte
interface UpdateProspectFormProps {
  prospect: Prospect;
  onSubmit: (data: UpdateProspectData) => void;
  isSubmitting: boolean; // <-- AJOUT : Recevoir l'état de soumission
}

// <-- CORRECTION : Utiliser le bon nom d'interface pour les props
export function UpdateProspectForm({ prospect, onSubmit, isSubmitting }: UpdateProspectFormProps) {
  const form = useForm<UpdateProspectData>({ // <-- CORRECTION : Typer le formulaire
    defaultValues: {
      status: prospect.status,
      assignedToId: prospect.assignedTo?.id || "",
    },
  });

  // La logique de soumission est maintenant gérée par le parent via la prop onSubmit
  // On utilise juste handleSubmit de react-hook-form pour valider et appeler cette prop
  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      {/* CORRECTION : Le formulaire doit être dans une balise <form> */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <FormField
          control={form.control} // <-- CORRECTION : Contrôle correct
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut du prospect</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent> {/* <-- CORRECTION : SelectContent est un sibling de SelectTrigger */}
                  {Object.entries(PROSPECT_STATUS_LABEL).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
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
                  {/* TODO: Fetch users based on user role */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour le prospect"}
        </Button>
      </form>
    </Form>
  );
}