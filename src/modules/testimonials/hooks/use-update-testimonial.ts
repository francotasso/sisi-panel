import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialsService } from "../services";
import type { TestimonialFormData } from "../types";
import { toast } from "sonner";

export function useUpdateTestimonial(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TestimonialFormData) => testimonialsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonial", id] });
      toast.success("Testimonio actualizado exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al actualizar testimonio");
    },
  });
}
