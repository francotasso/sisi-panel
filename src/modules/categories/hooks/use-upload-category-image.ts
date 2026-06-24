import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../services";
import { toast } from "sonner";

export function useUploadCategoryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, file }: { categoryId: string; file: File }) =>
      categoriesService.uploadImage(categoryId, file),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", category.id] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error al subir la imagen"
      );
    },
  });
}
