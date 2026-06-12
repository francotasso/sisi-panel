import { useQuery } from "@tanstack/react-query";
import { storeService } from "../services";

export function useStore() {
  return useQuery({
    queryKey: ["store"],
    queryFn: () => storeService.get(),
  });
}
