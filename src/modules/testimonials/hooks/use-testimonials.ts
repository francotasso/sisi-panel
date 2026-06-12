import { useQuery } from "@tanstack/react-query";
import { testimonialsService } from "../services";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => testimonialsService.getAll(),
  });
}
