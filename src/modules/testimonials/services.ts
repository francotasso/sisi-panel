import { apiClient } from "@/lib/api-client";
import type { Testimonial, TestimonialFormData, TestimonialsParams } from "./types";

export const testimonialsService = {
  getAll: (params?: TestimonialsParams) =>
    apiClient.get<Testimonial[]>("/testimonials", { params: params as Record<string, string | number | undefined> }),

  getById: (id: string) =>
    apiClient.get<Testimonial>(`/testimonials/${id}`),

  create: (data: TestimonialFormData) =>
    apiClient.post<Testimonial>("/testimonials", data),

  update: (id: string, data: TestimonialFormData) =>
    apiClient.put<Testimonial>(`/testimonials/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/testimonials/${id}`),
};
