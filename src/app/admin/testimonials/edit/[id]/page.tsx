"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { TestimonialForm } from "@/modules/testimonials/components/testimonial-form";
import { useTestimonial } from "@/modules/testimonials/hooks/use-testimonial";
import { useUpdateTestimonial } from "@/modules/testimonials/hooks/use-update-testimonial";
import type { TestimonialFormData } from "@/modules/testimonials/types";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: testimonial, isLoading } = useTestimonial(id);
  const updateTestimonial = useUpdateTestimonial(id);

  const onSubmit = (data: TestimonialFormData) => {
    updateTestimonial.mutate(data, {
      onSuccess: () => router.push("/admin/testimonials"),
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Editar testimonio"
        description={`Editando: ${testimonial?.name}`}
      />
      <TestimonialForm
        testimonial={testimonial}
        onSubmit={onSubmit}
        isSubmitting={updateTestimonial.isPending}
      />
    </div>
  );
}
