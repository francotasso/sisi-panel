import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services";
import type { CategoryFormData } from "../types";
import { toast } from "sonner";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryFormData) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al crear categoría");
    },
  });
}
