"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  LEAD_CHANNEL } from "@/lib/constants";
import { type CreateInteractionData, type UpdateInteractionData } from "@/types/interaction";

// Créez des types Zod basés sur vos constantes
const formSchema = z.object({
  channel: z.enum(Object.values(LEAD_CHANNEL) as [string, ...string[]]),
  notes: z.string().min(5, "Les notes doivent contenir au moins 5 caractères"),
  duration: z.number().optional(),
});

interface InteractionFormProps {
  prospectId: string; // ✅ Ajoute ceci
  defaultValues?: Partial<CreateInteractionData | UpdateInteractionData>;
  onSubmit: (data: CreateInteractionData | UpdateInteractionData) => Promise<void>;
  isLoading?: boolean;
}

export function InteractionForm({ prospectId, defaultValues, onSubmit, isLoading }: InteractionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: defaultValues?.channel || Object.values(LEAD_CHANNEL)[0],
      notes: defaultValues?.notes || "",
      duration: defaultValues?.duration || 0,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload: CreateInteractionData = {
      prospectId,
      channel: values.channel as CreateInteractionData["channel"], // ✅ Typage strict
      notes: values.notes,
      duration: values.duration,
    };

    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un canal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(LEAD_CHANNEL).map(([key, value]) => (
                    <SelectItem key={key} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 15" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Décrivez l'interaction..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
}