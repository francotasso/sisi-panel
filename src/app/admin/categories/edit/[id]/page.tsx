"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { CategoryForm } from "@/modules/categories/components/category-form";
import { useCategory } from "@/modules/categories/hooks/use-category";
import { useUpdateCategory } from "@/modules/categories/hooks/use-update-category";
import { useAuthStore } from "@/stores/auth-store";
import type { CategoryFormData } from "@/modules/categories/types";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params.id;
  const isEditor = useAuthStore((s) => {
    const u = s.user;
    return u?.role === "editor" || u?.user_metadata?.role === "editor";
  });

  useEffect(() => {
    if (isEditor) router.replace("/admin/categories");
  }, [isEditor, router]);

  if (isEditor) return null;

  const { data: category, isLoading } = useCategory(categoryId);
  const updateCategory = useUpdateCategory(categoryId);

  const onSubmit = (data: CategoryFormData) => {
    updateCategory.mutate(data, {
      onSuccess: () => router.push("/admin/categories"),
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Editar categoría"
        description={`Editando: ${category?.name}`}
      />
      <CategoryForm
        category={category}
        onSubmit={onSubmit}
        isSubmitting={updateCategory.isPending}
      />
    </div>
  );
}
