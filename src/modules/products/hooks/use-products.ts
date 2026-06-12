import { useQuery } from "@tanstack/react-query";
import { productsService } from "../services";
import type { ProductsParams } from "../types";

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getAll(params),
  });
}
