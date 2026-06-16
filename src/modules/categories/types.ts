export interface Category {
  id: string;
  name: string;
  slug?: string;
  created_at?: string;
}

export interface CategoryFormData {
  name: string;
}
