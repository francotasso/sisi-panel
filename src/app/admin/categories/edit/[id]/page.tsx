"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { FormSkeleton } from "@/components/shared/form-skeleton";
import { CategoryForm } from "@/modules/categories/components/category-form";
import { useCategory } from "@/modules/categories/hooks/use-category";
import { useUpdateCategory } from "@/modules/categories/hooks/use-update-category";
import { useUploadCategoryImage } from "@/modules/categories/hooks/use-upload-category-image";
import { useAuthStore } from "@/stores/auth-store";
import type { CategoryFormData } from "@/modules/categories/types";
import type { PendingImage } from "@/modules/categories/components/category-form";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params.id;
  const isEditor = useAuthStore((s) => {
    const u = s.user;
    return u?.role === "editor" || u?.user_metadata?.role === "editor";
  });
  const { data: category, isLoading } = useCategory(categoryId);
  const updateCategory = useUpdateCategory(categoryId);
  const uploadImage = useUploadCategoryImage();
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isPending = updateCategory.isPending || isUploading;

  useEffect(() => {
    if (isEditor) router.replace("/admin/categories");
  }, [isEditor, router]);

  if (isEditor) return null;

  const onSubmit = (data: CategoryFormData) => {
    if (!category) return;

    const submitData: CategoryFormData = {
      name: data.name,
      short_description: data.short_description,
    };
    if (pendingImage) {
      // will upload after update
    } else if (data.image) {
      submitData.image = data.image;
    } else if (data.image === null) {
      submitData.image = null;
    }

    updateCategory.mutate(submitData, {
      onSuccess: () => {
        if (pendingImage) {
          setIsUploading(true);
          uploadImage.mutate(
            { categoryId: category.id, file: pendingImage.file },
            {
              onSuccess: () => {
                toast.success("Categoría actualizada correctamente");
                router.push("/admin/categories");
              },
              onError: () => {
                toast.error("Categoría actualizada, pero hubo un error al subir la imagen");
                router.push("/admin/categories");
              },
              onSettled: () => {
                setIsUploading(false);
              },
            }
          );
        } else {
          toast.success("Categoría actualizada correctamente");
          router.push("/admin/categories");
        }
      },
    });
  };

  if (isLoading)
    return (
      <div className="max-w-lg">
        <div className="pb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <FormSkeleton fields={1} rows={1} />
      </div>
    );

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Editar categoría"
        description={`Editando: ${category?.name}`}
      />
      <CategoryForm
        category={category}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        pendingImage={pendingImage}
        onPendingImageChange={setPendingImage}
      />
    </div>
  );
}
