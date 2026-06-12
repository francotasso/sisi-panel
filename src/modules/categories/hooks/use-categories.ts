import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../services";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
  });
}
