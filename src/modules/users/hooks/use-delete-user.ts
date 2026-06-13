import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services";
import { toast } from "sonner";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al eliminar usuario");
    },
  });
}
