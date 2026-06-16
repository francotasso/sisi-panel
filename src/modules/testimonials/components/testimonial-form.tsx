"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Resolver } from "react-hook-form";
import type { Testimonial, TestimonialFormData } from "../types";

const testimonialSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  text: z.string().min(1, "El texto es requerido"),
  avatar: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
});

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSubmit: (data: TestimonialFormData) => void;
  isSubmitting?: boolean;
}

export function TestimonialForm({ testimonial, onSubmit, isSubmitting }: TestimonialFormProps) {
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema) as Resolver<TestimonialFormData>,
    defaultValues: {
      name: testimonial?.name ?? "",
      text: testimonial?.text ?? "",
      avatar: testimonial?.avatar ?? "",
      rating: testimonial?.rating ?? 5,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonio</FormLabel>
              <FormControl>
                <Textarea placeholder="Escribe el testimonio..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de avatar</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calificación (0-5)</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={5} step={0.5} placeholder="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {testimonial ? "Actualizar testimonio" : "Crear testimonio"}
        </Button>
      </form>
    </Form>
  );
}
