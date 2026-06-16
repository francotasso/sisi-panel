import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services";
import type { ProductFormData } from "../types";
import { toast } from "sonner";

export function useUpdateProduct(id: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al actualizar producto");
    },
  });
}
