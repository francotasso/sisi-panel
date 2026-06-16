"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/modules/products/components/products-table";
import { useCategories } from "@/modules/categories/hooks/use-categories";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const { data: categories } = useCategories();

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Gestiona tu catálogo de productos"
      >
        <Link href="/admin/products/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </PageHeader>
      <ProductsTable categories={categories ?? []} />
    </div>
  );
}
