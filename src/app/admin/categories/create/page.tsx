"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryForm } from "@/modules/categories/components/category-form";
import { useCreateCategory } from "@/modules/categories/hooks/use-create-category";
import { useAuthStore } from "@/stores/auth-store";
import type { CategoryFormData } from "@/modules/categories/types";

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const isEditor = useAuthStore((s) => {
    const u = s.user;
    return u?.role === "editor" || u?.user_metadata?.role === "editor";
  });

  useEffect(() => {
    if (isEditor) router.replace("/admin/categories");
  }, [isEditor, router]);

  if (isEditor) return null;

  const onSubmit = (data: CategoryFormData) => {
    createCategory.mutate(data, {
      onSuccess: () => router.push("/admin/categories"),
    });
  };

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Crear categoría"
        description="Añade una nueva categoría"
      />
      <CategoryForm onSubmit={onSubmit} isSubmitting={createCategory.isPending} />
    </div>
  );
}
