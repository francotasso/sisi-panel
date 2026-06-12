import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services";

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  });
}
