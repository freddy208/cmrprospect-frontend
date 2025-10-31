// src/app/(dashboard)/comments/components/CommentForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { type CreateCommentData, type UpdateCommentData } from "@/types/comment";

// Créez des types Zod basés sur vos constantes
const formSchema = z.object({
  content: z.string().min(5, "Le commentaire doit contenir au moins 5 caractères"),
});

interface CommentFormProps {
  prospectId: string;
  defaultValues?: Partial<CreateCommentData | UpdateCommentData>;
  onSubmit: (data: CreateCommentData | UpdateCommentData) => Promise<void>;
  isLoading?: boolean;
}

export function CommentForm({ prospectId, defaultValues, onSubmit, isLoading }: CommentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: defaultValues?.content || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload: CreateCommentData = {
      prospectId,
      content: values.content,
    };

    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaire</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Ajoutez votre commentaire..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          style={{ backgroundColor: "#1D4ED8" }}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
}