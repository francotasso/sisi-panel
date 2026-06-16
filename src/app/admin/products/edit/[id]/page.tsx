"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { FormSkeleton } from "@/components/shared/form-skeleton";
import { ProductForm } from "@/modules/products/components/product-form";
import { useProduct } from "@/modules/products/hooks/use-product";
import { useUpdateProduct } from "@/modules/products/hooks/use-update-product";
import { useUploadProductImage } from "@/modules/products/hooks/use-upload-image";
import { useCategories } from "@/modules/categories/hooks/use-categories";
import type { PendingImage } from "@/modules/products/components/product-form";
import type { ProductFormData } from "@/modules/products/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const slug = params.id;

  const { data: product, isLoading } = useProduct(slug);
  const updateProduct = useUpdateProduct(product?.id ?? "", slug);
  const uploadImage = useUploadProductImage();
  const { data: categories } = useCategories();
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isPending = updateProduct.isPending || isUploading;

  const onSubmit = (data: ProductFormData) => {
    if (!product) return;

    const submitData = pendingImage ? { ...data, image: undefined } : data;

    updateProduct.mutate(submitData, {
      onSuccess: () => {
        if (pendingImage) {
          setIsUploading(true);
          uploadImage.mutate(
            { productId: product.id, file: pendingImage.file },
            {
              onSuccess: () => {
                toast.success("Producto actualizado correctamente");
                router.push("/admin/products");
              },
              onError: () => {
                toast.error("Producto actualizado, pero hubo un error al subir la imagen");
                router.push("/admin/products");
              },
              onSettled: () => {
                setIsUploading(false);
              },
            }
          );
        } else {
          toast.success("Producto actualizado correctamente");
          router.push("/admin/products");
        }
      },
    });
  };

  if (isLoading)
    return (
      <div className="max-w-3xl">
        <div className="pb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <FormSkeleton fields={6} rows={3} />
      </div>
    );

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
        isSubmitting={isPending}
        pendingImage={pendingImage}
        onPendingImageChange={setPendingImage}
      />
    </div>
  );
}
