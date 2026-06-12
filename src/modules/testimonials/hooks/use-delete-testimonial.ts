import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialsService } from "../services";
import { toast } from "sonner";

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => testimonialsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonio eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al eliminar testimonio");
    },
  });
}
