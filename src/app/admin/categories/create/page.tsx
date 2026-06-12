"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryForm } from "@/modules/categories/components/category-form";
import { useCreateCategory } from "@/modules/categories/hooks/use-create-category";
import type { CategoryFormData } from "@/modules/categories/types";

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();

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
