"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { ProductForm } from "@/modules/products/components/product-form";
import { useCreateProduct } from "@/modules/products/hooks/use-create-product";
import { useUploadProductImage } from "@/modules/products/hooks/use-upload-image";
import { useCategories } from "@/modules/categories/hooks/use-categories";
import type { PendingImage } from "@/modules/products/components/product-form";
import type { ProductFormData } from "@/modules/products/types";

export default function CreateProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const uploadImage = useUploadProductImage();
  const { data: categories } = useCategories();
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isPending = createProduct.isPending || isUploading;

  const onSubmit = (data: ProductFormData) => {
    const submitData = pendingImage ? { ...data, image: undefined } : data;

    createProduct.mutate(submitData, {
      onSuccess: (product) => {
        if (pendingImage) {
          setIsUploading(true);
          uploadImage.mutate(
            { productId: product.id, file: pendingImage.file },
            {
              onSuccess: () => {
                toast.success("Producto creado correctamente");
                router.push("/admin/products");
              },
              onError: () => {
                toast.error("Producto creado, pero hubo un error al subir la imagen");
                router.push("/admin/products");
              },
              onSettled: () => {
                setIsUploading(false);
              },
            }
          );
        } else {
          toast.success("Producto creado correctamente");
          router.push("/admin/products");
        }
      },
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
        isSubmitting={isPending}
        pendingImage={pendingImage}
        onPendingImageChange={setPendingImage}
      />
    </div>
  );
}
