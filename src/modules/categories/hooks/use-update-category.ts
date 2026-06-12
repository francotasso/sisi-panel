import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services";
import type { CategoryFormData } from "../types";
import { toast } from "sonner";

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryFormData) => categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      toast.success("Categoría actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al actualizar categoría");
    },
  });
}
