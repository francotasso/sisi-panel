export interface Category {
  id: string;
  name: string;
  slug?: string;
  short_description?: string;
  image?: string;
  created_at?: string;
}

export interface CategoryFormData {
  name: string;
  short_description?: string;
  image?: string | null;
}
