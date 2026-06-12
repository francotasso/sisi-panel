"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import type { Resolver } from "react-hook-form";
import type { Product, ProductFormData } from "../types";
import type { Category } from "@/modules/categories/types";

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
}

export function ProductForm({ product, categories, onSubmit, isSubmitting }: ProductFormProps) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        onSubmit({
          ...data,
          discount_price: discountEnabled ? (data.discount_price ?? 0) : null,
        });
      })} className="space-y-8">
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
                  <Input placeholder="SKU del producto" {...field} />
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de imagen</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              {field.value && (
                <div className="relative mt-2 overflow-hidden rounded-md border">
                  <Image
                    src={field.value}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
              )}
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

        <div>
          <h3 className="mb-4 text-lg font-medium">Especificaciones</h3>
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
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">FAQ</h3>
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
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start rounded-lg border p-4">
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
                  className="mt-6 shrink-0 text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {product ? "Actualizar producto" : "Crear producto"}
        </Button>
      </form>
    </Form>
  );
}
