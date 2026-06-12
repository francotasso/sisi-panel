"use client";

import { PageHeader } from "@/components/shared/page-header";
import { TestimonialsTable } from "@/modules/testimonials/components/testimonials-table";

export default function TestimonialsPage() {
  return (
    <div>
      <PageHeader
        title="Testimonios"
        description="Gestiona los testimonios de clientes"
      />
      <TestimonialsTable />
    </div>
  );
}
