import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services";
import { toast } from "sonner";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al eliminar producto");
    },
  });
}
