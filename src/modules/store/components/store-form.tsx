"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2, Loader2, Store as StoreIcon, Phone, Clock, Share2 } from "lucide-react";
import type { Store, StoreFormData } from "../types";

const contactSchema = z.object({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  address_map: z.string().optional(),
});

const hoursSchema = z.object({
  day: z.string().min(1, "El día es requerido"),
  open_time: z.string().optional(),
  close_time: z.string().optional(),
  is_closed: z.boolean().optional(),
});

const socialMediaSchema = z.object({
  platform: z.string().min(1, "La plataforma es requerida"),
  url: z.string().min(1, "La URL es requerida"),
});

const storeSchema = z.object({
  store_name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  contact: contactSchema.optional(),
  hours: z.array(hoursSchema).optional(),
  social_media: z.array(socialMediaSchema).optional(),
});

interface StoreFormProps {
  store?: Store;
  onSubmit: (data: StoreFormData) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export function StoreForm({ store, onSubmit, isSubmitting, readOnly }: StoreFormProps) {
  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      store_name: store?.store_name ?? "",
      description: store?.description ?? "",
      contact: store?.contact ?? {},
      hours: store?.hours ?? [],
      social_media: store?.social_media ?? [],
    },
  });

  const { fields: hoursFields, append: appendHour, remove: removeHour } = useFieldArray({
    control: form.control,
    name: "hours",
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: "social_media",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <StoreIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">Información de la tienda</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nombre de la tienda</FormLabel>
                  <FormControl>
                    <Input disabled={readOnly} placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea disabled={readOnly} placeholder="Descripción de la tienda" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 pb-4">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">Contacto</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input disabled={readOnly} placeholder="+54 11 1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact.whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input disabled={readOnly} placeholder="+54 11 1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tienda@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact.address_map"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del mapa</FormLabel>
                  <FormControl>
                    <Input disabled={readOnly} placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact.address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input disabled={readOnly} placeholder="Calle y número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 pb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">Horarios</h2>
          </div>
          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={() => appendHour({ day: "", is_closed: false })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar horario
            </Button>
          )}
          <div className="space-y-4">
            {hoursFields.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center bg-muted/30 rounded-lg">
                No hay horarios cargados.
              </p>
            ) : (
              hoursFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start rounded-lg border p-4 transition-colors hover:border-muted-foreground/30">
                  <div className="flex-1 grid gap-3 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name={`hours.${index}.day`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Día</FormLabel>
                          <FormControl>
                            <Input disabled={readOnly} placeholder="Lunes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`hours.${index}.open_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apertura</FormLabel>
                          <FormControl>
                            <Input disabled={readOnly} placeholder="09:00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`hours.${index}.close_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cierre</FormLabel>
                          <FormControl>
                            <Input disabled={readOnly} placeholder="18:00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`hours.${index}.is_closed`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 pt-6">
                          <FormControl>
                            <Checkbox
                              disabled={readOnly}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Cerrado</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() => removeHour(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 pb-4">
            <Share2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">Redes sociales</h2>
          </div>
          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={() => appendSocial({ platform: "", url: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar red social
            </Button>
          )}
          <div className="space-y-4">
            {socialFields.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center bg-muted/30 rounded-lg">
                No hay redes sociales cargadas.
              </p>
            ) : (
              socialFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start rounded-lg border p-4 transition-colors hover:border-muted-foreground/30">
                  <div className="flex-1 grid gap-3 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`social_media.${index}.platform`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plataforma</FormLabel>
                          <FormControl>
                            <Input disabled={readOnly} placeholder="instagram" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`social_media.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input disabled={readOnly} placeholder="https://instagram.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() => removeSocial(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || readOnly} size="lg" className="min-w-[160px]">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {readOnly ? "Solo lectura" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
