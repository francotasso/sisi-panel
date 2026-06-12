"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ProductForm } from "@/modules/products/components/product-form";
import { useProduct } from "@/modules/products/hooks/use-product";
import { useUpdateProduct } from "@/modules/products/hooks/use-update-product";
import { useCategories } from "@/modules/categories/hooks/use-categories";
import type { ProductFormData } from "@/modules/products/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const slug = params.id;

  const { data: product, isLoading } = useProduct(slug);
  const updateProduct = useUpdateProduct(product?.id ?? "", slug);
  const { data: categories } = useCategories();

  const onSubmit = (data: ProductFormData) => {
    if (!product) return;
    updateProduct.mutate(data, {
      onSuccess: () => router.push("/admin/products"),
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Editar producto"
        description={`Editando: ${product?.name}`}
      />
      <ProductForm
        product={product}
        categories={categories ?? []}
        onSubmit={onSubmit}
        isSubmitting={updateProduct.isPending}
      />
    </div>
  );
}
