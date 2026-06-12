import { useQuery } from "@tanstack/react-query";
import { testimonialsService } from "../services";

export function useTestimonial(id: string) {
  return useQuery({
    queryKey: ["testimonial", id],
    queryFn: () => testimonialsService.getById(id),
    enabled: !!id,
  });
}
