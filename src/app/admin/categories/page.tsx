"use client";

import { PageHeader } from "@/components/shared/page-header";
import { CategoriesTable } from "@/modules/categories/components/categories-table";

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Gestiona las categorías de productos"
      />
      <CategoriesTable />
    </div>
  );
}
