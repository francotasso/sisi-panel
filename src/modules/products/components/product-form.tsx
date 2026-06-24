"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Plus, Trash2, Loader2, Upload, ImageIcon, Info, ListChecks, HelpCircle, X } from "lucide-react";
import type { Resolver } from "react-hook-form";
import type { Product, ProductFormData } from "../types";
import type { Category } from "@/modules/categories/types";
import { cn } from "@/lib/utils";

export interface PendingImage {
  file: File;
  preview: string;
}

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  discount_price: z.coerce.number().optional(),
  best_seller: z.boolean().optional(),
  category_id: z.string().min(1, "La categoría es requerida"),
  image: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  stock: z.boolean(),
  stock_count: z.coerce.number().optional(),
  sku: z.string().optional(),
  specs: z.object({
    brand: z.string().optional(),
    product_type: z.string().optional(),
    shade: z.string().optional(),
    finish: z.string().optional(),
    size: z.string().optional(),
    ingredients: z.string().optional(),
    spf: z.string().optional(),
    skin_type: z.string().optional(),
    notes: z.string().optional(),
    benefits: z.string().optional(),
    includes: z.string().optional(),
  }),
  faqs: z.array(z.object({
    question: z.string().min(1, "La pregunta es requerida"),
    answer: z.string().min(1, "La respuesta es requerida"),
  })),
});

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
  pendingImage?: PendingImage | null;
  onPendingImageChange?: (image: PendingImage | null) => void;
}

export function ProductForm({ product, categories, onSubmit, isSubmitting, pendingImage, onPendingImageChange }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues: {
      name: product?.name ?? "",
      price: Number(product?.price ?? 0),
      discount_price: product?.discount_price != null && product.discount_price !== ""
        ? Number(product.discount_price)
        : undefined,
      best_seller: product?.best_seller ?? false,
      category_id: product?.category_id ?? "",
      image: product?.image ?? "",
      description: product?.description ?? "",
      short_description: product?.short_description ?? "",
      stock: product?.stock ?? true,
      stock_count: product?.stock_count ?? 0,
      sku: product?.sku ?? "",
      specs: {
        brand: product?.specs?.brand ?? "",
        product_type: product?.specs?.product_type ?? "",
        shade: product?.specs?.shade ?? "",
        finish: product?.specs?.finish ?? "",
        size: product?.specs?.size ?? "",
        ingredients: product?.specs?.ingredients ?? "",
        spf: product?.specs?.spf ?? "",
        skin_type: product?.specs?.skin_type ?? "",
        notes: product?.specs?.notes ?? "",
        benefits: product?.specs?.benefits ?? "",
        includes: product?.specs?.includes ?? "",
      },
      faqs: product?.faqs ?? [],
    },
  });

  const [discountEnabled, setDiscountEnabled] = useState(
    product?.discount_price != null && product.discount_price !== ""
  );

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setDiscountEnabled(product.discount_price != null && product.discount_price !== "");
      form.reset({
        name: product.name,
        price: Number(product.price),
        discount_price: product.discount_price != null && product.discount_price !== ""
          ? Number(product.discount_price)
          : undefined,
        best_seller: product.best_seller ?? false,
        category_id: product.category_id,
        image: product.image ?? "",
        description: product.description ?? "",
        short_description: product.short_description ?? "",
        stock: product.stock,
        stock_count: product.stock_count ?? 0,
        sku: product.sku ?? "",
        specs: {
          brand: product.specs?.brand ?? "",
          product_type: product.specs?.product_type ?? "",
          shade: product.specs?.shade ?? "",
          finish: product.specs?.finish ?? "",
          size: product.specs?.size ?? "",
          ingredients: product.specs?.ingredients ?? "",
          spf: product.specs?.spf ?? "",
          skin_type: product.specs?.skin_type ?? "",
          notes: product.specs?.notes ?? "",
          benefits: product.specs?.benefits ?? "",
          includes: product.specs?.includes ?? "",
        },
        faqs: product.faqs ?? [],
      });
    }
  }, [product, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const specFields = [
    { name: "brand" as const, label: "Marca" },
    { name: "product_type" as const, label: "Tipo" },
    { name: "shade" as const, label: "Tono" },
    { name: "finish" as const, label: "Acabado" },
    { name: "size" as const, label: "Tamaño" },
    { name: "ingredients" as const, label: "Ingredientes" },
    { name: "spf" as const, label: "SPF" },
    { name: "skin_type" as const, label: "Tipo de piel" },
    { name: "notes" as const, label: "Notas" },
    { name: "benefits" as const, label: "Beneficios" },
    { name: "includes" as const, label: "Incluye" },
  ];

  useEffect(() => {
    return () => {
      if (pendingImage?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(pendingImage.preview);
      }
    };
  }, [pendingImage]);

  const handleFileDrop = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      onPendingImageChange?.({ file, preview });
      form.setValue("image", "");
    }
  }, [form, onPendingImageChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileDrop(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDrop(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        onSubmit({
          ...data,
          discount_price: discountEnabled ? (data.discount_price ?? 0) : null,
        });
      })} className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <CardTitle>Información básica</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="discount-toggle"
                  checked={discountEnabled}
                  onCheckedChange={(checked) => {
                    setDiscountEnabled(!!checked);
                    if (!checked) form.setValue("discount_price", undefined);
                  }}
                />
                <label htmlFor="discount-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Aplicar descuento
                </label>
              </div>
              <FormField
                control={form.control}
                name="discount_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio con descuento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        onBlur={field.onBlur}
                        disabled={!discountEnabled}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría">
                            {categories.find((c) => c.id === field.value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-generado" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad en stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Disponible</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="best_seller"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Best seller</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                const currentPreview = pendingImage?.preview ?? field.value ?? product?.image ?? "";
                const isValidUrl = currentPreview.startsWith("http://") ||
                                   currentPreview.startsWith("https://") ||
                                   currentPreview.startsWith("blob:") ||
                                   currentPreview.startsWith("data:");
                const hasPreview = !!currentPreview && isValidUrl;
                const isFromUrl = !pendingImage && !!field.value;

                return (
                  <FormItem>
                    <FormLabel>Imagen del producto</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => !hasPreview && fileInputRef.current?.click()}
                          className={cn(
                            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
                            isDragOver
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/25 hover:border-muted-foreground/50",
                            pendingImage && "border-primary/50 bg-primary/5"
                          )}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                          {hasPreview ? (
                            <div className="relative">
                              <div className="relative h-32 w-32 overflow-hidden rounded-md">
                                <Image
                                  src={currentPreview}
                                  alt="Preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (pendingImage) {
                                    URL.revokeObjectURL(pendingImage.preview);
                                    onPendingImageChange?.(null);
                                  } else {
                                    field.onChange("");
                                  }
                                }}
                                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-background border text-muted-foreground hover:text-foreground shadow-sm"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <p className="mt-2 text-xs text-center text-muted-foreground">
                                {pendingImage ? "Archivo listo para subir" : "Imagen desde URL"}
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload className="mb-2 h-8 w-8 text-muted-foreground/60" />
                              <p className="text-sm font-medium text-muted-foreground">
                                Arrastrá una imagen o hacé clic para subir
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground/60">
                                o ingresá una URL debajo
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <Input
                            placeholder="https://..."
                            value={field.value ?? ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              if (pendingImage) {
                                URL.revokeObjectURL(pendingImage.preview);
                                onPendingImageChange?.(null);
                              }
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            className="flex-1"
                            disabled={!!pendingImage}
                          />
                        </div>
                        {pendingImage && (
                          <p className="text-xs text-muted-foreground">
                            Archivo seleccionado: <span className="font-medium">{pendingImage.file.name}</span>
                            {" — "}se subirá al guardar el producto
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción corta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Breve descripción" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción completa" className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              <CardTitle>Especificaciones</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {specFields.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={`specs.${name}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <CardTitle>Preguntas frecuentes</CardTitle>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ question: "", answer: "" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar FAQ
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <HelpCircle className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No hay preguntas frecuentes. Agregá una usando el botón de arriba.
                </p>
              </div>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start rounded-lg border p-4 transition-colors hover:border-muted-foreground/30">
                  <div className="flex-1 space-y-3">
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pregunta</FormLabel>
                          <FormControl>
                            <Input placeholder="Pregunta frecuente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Respuesta</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Respuesta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 shrink-0 text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[160px]">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Actualizar producto" : "Crear producto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
