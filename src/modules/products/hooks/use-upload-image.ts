import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services";
import { toast } from "sonner";

export function useUploadProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, file }: { productId: string; file: File }) =>
      productsService.uploadImage(productId, file),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["product", product.slug] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error al subir la imagen"
      );
    },
  });
}
