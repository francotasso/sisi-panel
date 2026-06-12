import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../services";
import type { StoreFormData } from "../types";
import { toast } from "sonner";

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreFormData) => storeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Tienda creada exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al crear tienda");
    },
  });
}
