import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services";
import { toast } from "sonner";
import type { UpdateUserPayload } from "../types";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario actualizado exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al actualizar usuario");
    },
  });
}
