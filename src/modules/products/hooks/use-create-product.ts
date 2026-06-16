import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services";
import type { ProductFormData } from "../types";
import { toast } from "sonner";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al crear producto");
    },
  });
}
