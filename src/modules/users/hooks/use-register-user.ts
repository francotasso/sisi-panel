import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services";
import { toast } from "sonner";
import type { RegisterUserPayload } from "../types";

export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterUserPayload) => usersService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario creado exitosamente");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Error al crear usuario");
    },
  });
}
