export interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar?: string;
  rating?: number;
  created_at?: string;
}

export interface TestimonialFormData {
  name: string;
  text: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsParams {
  skip?: number;
  limit?: number;
}
