import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services";
import { toast } from "sonner";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al eliminar categoría");
    },
  });
}
