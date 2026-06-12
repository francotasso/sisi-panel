"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { TestimonialForm } from "@/modules/testimonials/components/testimonial-form";
import { useCreateTestimonial } from "@/modules/testimonials/hooks/use-create-testimonial";
import type { TestimonialFormData } from "@/modules/testimonials/types";

export default function CreateTestimonialPage() {
  const router = useRouter();
  const createTestimonial = useCreateTestimonial();

  const onSubmit = (data: TestimonialFormData) => {
    createTestimonial.mutate(data, {
      onSuccess: () => router.push("/admin/testimonials"),
    });
  };

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Nuevo testimonio"
        description="Añade un testimonio de cliente"
      />
      <TestimonialForm
        onSubmit={onSubmit}
        isSubmitting={createTestimonial.isPending}
      />
    </div>
  );
}
