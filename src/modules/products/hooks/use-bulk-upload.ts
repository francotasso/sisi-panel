import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services";
import { toast } from "sonner";

export function useBulkUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => productsService.bulkUpload(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`${result.created} producto(s) subido(s) exitosamente`);
      if (result.errors && result.errors.length > 0) {
        toast.error(`${result.errors.length} error(es) en la carga`);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al subir productos");
    },
  });
}
