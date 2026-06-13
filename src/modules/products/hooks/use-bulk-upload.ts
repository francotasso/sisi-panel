import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services";
import { toast } from "sonner";

interface BulkUploadVariables {
  data: Record<string, unknown>;
  mode: "replace" | "append";
}

export function useBulkUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, mode }: BulkUploadVariables) =>
      mode === "replace"
        ? productsService.bulkReplace(data)
        : productsService.bulkUpload(data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      const action =
        variables.mode === "replace" ? "reemplazados" : "agregados";
      toast.success(`${result.created} producto(s) ${action} exitosamente`);
      if (result.errors && result.errors.length > 0) {
        toast.error(`${result.errors.length} error(es) en la carga`);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al subir productos");
    },
  });
}
