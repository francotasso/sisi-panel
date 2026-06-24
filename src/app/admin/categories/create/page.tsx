"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryForm } from "@/modules/categories/components/category-form";
import { useCreateCategory } from "@/modules/categories/hooks/use-create-category";
import { useUploadCategoryImage } from "@/modules/categories/hooks/use-upload-category-image";
import { useAuthStore } from "@/stores/auth-store";
import type { CategoryFormData } from "@/modules/categories/types";
import type { PendingImage } from "@/modules/categories/components/category-form";

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const uploadImage = useUploadCategoryImage();
  const isEditor = useAuthStore((s) => {
    const u = s.user;
    return u?.role === "editor" || u?.user_metadata?.role === "editor";
  });
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEditor) router.replace("/admin/categories");
  }, [isEditor, router]);

  if (isEditor) return null;

  const isPending = createCategory.isPending || isUploading;

  const onSubmit = (data: CategoryFormData) => {
    const submitData: CategoryFormData = {
      name: data.name,
      short_description: data.short_description,
    };
    if (!pendingImage && data.image) {
      submitData.image = data.image;
    }

    createCategory.mutate(submitData, {
      onSuccess: (category) => {
        if (pendingImage) {
          setIsUploading(true);
          uploadImage.mutate(
            { categoryId: category.id, file: pendingImage.file },
            {
              onSuccess: () => {
                toast.success("Categoría creada correctamente");
                router.push("/admin/categories");
              },
              onError: () => {
                toast.error("Categoría creada, pero hubo un error al subir la imagen");
                router.push("/admin/categories");
              },
              onSettled: () => {
                setIsUploading(false);
              },
            }
          );
        } else {
          toast.success("Categoría creada correctamente");
          router.push("/admin/categories");
        }
      },
    });
  };

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Crear categoría"
        description="Añade una nueva categoría"
      />
      <CategoryForm
        onSubmit={onSubmit}
        isSubmitting={isPending}
        pendingImage={pendingImage}
        onPendingImageChange={setPendingImage}
      />
    </div>
  );
}
