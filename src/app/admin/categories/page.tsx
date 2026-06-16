"use client";

import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "@/modules/categories/components/categories-table";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const user = useAuthStore((s) => s.user);
  const isEditor = user?.role === "editor" || user?.user_metadata?.role === "editor";

  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Gestiona las categorías de productos"
      >
        {!isEditor && (
          <Link href="/admin/categories/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva categoría
            </Button>
          </Link>
        )}
      </PageHeader>
      <CategoriesTable />
    </div>
  );
}
