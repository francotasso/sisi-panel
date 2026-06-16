"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { FormSkeleton } from "@/components/shared/form-skeleton";
import { TestimonialForm } from "@/modules/testimonials/components/testimonial-form";
import { useTestimonial } from "@/modules/testimonials/hooks/use-testimonial";
import { useUpdateTestimonial } from "@/modules/testimonials/hooks/use-update-testimonial";
import { useAuthStore } from "@/stores/auth-store";
import type { TestimonialFormData } from "@/modules/testimonials/types";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const isEditor = useAuthStore((s) => {
    const u = s.user;
    return u?.role === "editor" || u?.user_metadata?.role === "editor";
  });

  useEffect(() => {
    if (isEditor) router.replace("/admin/testimonials");
  }, [isEditor, router]);

  if (isEditor) return null;

  const { data: testimonial, isLoading } = useTestimonial(id);
  const updateTestimonial = useUpdateTestimonial(id);

  const onSubmit = (data: TestimonialFormData) => {
    updateTestimonial.mutate(data, {
      onSuccess: () => {
        toast.success("Testimonio actualizado correctamente");
        router.push("/admin/testimonials");
      },
    });
  };

  if (isLoading)
    return (
      <div className="max-w-lg">
        <div className="pb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <FormSkeleton fields={2} rows={1} />
      </div>
    );

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
