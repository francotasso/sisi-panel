"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { TestimonialForm } from "@/modules/testimonials/components/testimonial-form";
import { useCreateTestimonial } from "@/modules/testimonials/hooks/use-create-testimonial";
import { useAuthStore } from "@/stores/auth-store";
import type { TestimonialFormData } from "@/modules/testimonials/types";

export default function CreateTestimonialPage() {
  const router = useRouter();
  const createTestimonial = useCreateTestimonial();
  const isEditor = useAuthStore((s) => {
    const u = s.user;
    return u?.role === "editor" || u?.user_metadata?.role === "editor";
  });

  useEffect(() => {
    if (isEditor) router.replace("/admin/testimonials");
  }, [isEditor, router]);

  if (isEditor) return null;

  const onSubmit = (data: TestimonialFormData) => {
    createTestimonial.mutate(data, {
      onSuccess: () => {
        toast.success("Testimonio creado correctamente");
        router.push("/admin/testimonials");
      },
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
