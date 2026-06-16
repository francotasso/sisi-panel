"use client";

import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { TestimonialsTable } from "@/modules/testimonials/components/testimonials-table";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TestimonialsPage() {
  const user = useAuthStore((s) => s.user);
  const isEditor = user?.role === "editor" || user?.user_metadata?.role === "editor";

  return (
    <div>
      <PageHeader
        title="Testimonios"
        description="Gestiona los testimonios de clientes"
      >
        {!isEditor && (
          <Link href="/admin/testimonials/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo testimonio
            </Button>
          </Link>
        )}
      </PageHeader>
      <TestimonialsTable />
    </div>
  );
}
