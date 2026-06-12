"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ProductsTable } from "@/modules/products/components/products-table";
import { useCategories } from "@/modules/categories/hooks/use-categories";

export default function ProductsPage() {
  const { data: categories } = useCategories();

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Gestiona tu catálogo de productos"
      />
      <ProductsTable categories={categories ?? []} />
    </div>
  );
}
