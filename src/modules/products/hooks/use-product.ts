import { useQuery } from "@tanstack/react-query";
import { productsService } from "../services";

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsService.getBySlug(slug),
    enabled: !!slug,
  });
}
