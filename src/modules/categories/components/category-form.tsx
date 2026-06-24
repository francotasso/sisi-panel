"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Category, CategoryFormData } from "../types";
import { cn } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  short_description: z.string().optional(),
  image: z.string().optional().nullable(),
});

export type PendingImage = { file: File; preview: string };

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => void;
  isSubmitting?: boolean;
  pendingImage?: PendingImage | null;
  onPendingImageChange?: (value: PendingImage | null) => void;
}

export function CategoryForm({
  category,
  onSubmit,
  isSubmitting,
  pendingImage,
  onPendingImageChange,
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      short_description: category?.short_description ?? "",
      image: category?.image ?? "",
    },
  });

  const imageUrl = form.watch("image");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const isValidPreview = (url: string | null | undefined) => {
    if (!url) return false;
    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:") ||
      url.startsWith("data:")
    );
  };

  const previewUrl = pendingImage
    ? pendingImage.preview
    : isValidPreview(imageUrl)
      ? imageUrl
      : null;

  const handleFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;

    if (pendingImage) URL.revokeObjectURL(pendingImage.preview);
    onPendingImageChange?.({ file, preview: URL.createObjectURL(file) });
    form.setValue("image", "", { shouldValidate: false });
  };

  const handleRemove = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage.preview);
      onPendingImageChange?.(null);
    }
    form.setValue("image", null, { shouldValidate: false });
  };

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
                <Input placeholder="Nombre de la categoría" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción corta</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Breve descripción de la categoría"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Imagen</p>
            {category?.image && !pendingImage && !imageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive h-auto px-2 py-1 text-xs"
                onClick={handleRemove}
              >
                <X className="mr-1 h-3 w-3" />
                Remover imagen
              </Button>
            )}
            {previewUrl && (pendingImage || imageUrl) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive h-auto px-2 py-1 text-xs"
                onClick={handleRemove}
              >
                <X className="mr-1 h-3 w-3" />
                {pendingImage ? "Cancelar archivo" : "Remover imagen"}
              </Button>
            )}
          </div>

          {previewUrl && (
            <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={!!pendingImage}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      if (pendingImage) {
                        URL.revokeObjectURL(pendingImage.preview);
                        onPendingImageChange?.(null);
                      }
                      field.onChange(e.target.value || undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {pendingImage ? "Archivo seleccionado" : "Subir imagen"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Arrastrá una imagen o hacé clic para seleccionar
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {category ? "Actualizar categoría" : "Crear categoría"}
        </Button>
      </form>
    </Form>
  );
}
