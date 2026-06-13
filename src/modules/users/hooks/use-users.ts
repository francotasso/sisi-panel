import { useQuery } from "@tanstack/react-query";
import { usersService } from "../services";

function normalizeUser(u: {
  id: string;
  email: string;
  role: string;
  name?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
}) {
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? (u.user_metadata?.name as string | undefined) ?? "",
    role: (u.user_metadata?.role as string | undefined) ?? u.role,
    created_at: u.created_at,
  };
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await usersService.getAll();
      return res.users.map(normalizeUser);
    },
  });
}
