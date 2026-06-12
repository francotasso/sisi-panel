import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../services";
import type { StoreFormData } from "../types";
import { toast } from "sonner";

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreFormData) => storeService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Tienda actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al actualizar tienda");
    },
  });
}
