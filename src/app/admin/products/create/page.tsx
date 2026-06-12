"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ProductForm } from "@/modules/products/components/product-form";
import { useCreateProduct } from "@/modules/products/hooks/use-create-product";
import { useCategories } from "@/modules/categories/hooks/use-categories";
import type { ProductFormData } from "@/modules/products/types";

export default function CreateProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categories } = useCategories();

  const onSubmit = (data: ProductFormData) => {
    createProduct.mutate(data, {
      onSuccess: () => router.push("/admin/products"),
    });
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Crear producto"
        description="Añade un nuevo producto al catálogo"
      />
      <ProductForm
        categories={categories ?? []}
        onSubmit={onSubmit}
        isSubmitting={createProduct.isPending}
      />
    </div>
  );
}
