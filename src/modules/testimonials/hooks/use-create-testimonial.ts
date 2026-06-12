import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialsService } from "../services";
import type { TestimonialFormData } from "../types";
import { toast } from "sonner";

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TestimonialFormData) => testimonialsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonio creado exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al crear testimonio");
    },
  });
}
