export interface ProductSpecs {
  brand?: string;
  product_type?: string;
  shade?: string;
  finish?: string;
  size?: string;
  ingredients?: string;
  spf?: string;
  skin_type?: string;
  notes?: string;
  benefits?: string;
  includes?: string;
}

export interface ProductFAQ {
  id?: number;
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  discount_price?: string;
  best_seller?: boolean;
  category_id: string;
  category_name?: string;
  image?: string;
  description?: string;
  short_description?: string;
  stock: boolean;
  stock_count?: number;
  sku?: string;
  specs?: ProductSpecs;
  faqs?: ProductFAQ[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  discount_price?: number | null;
  best_seller?: boolean;
  category_id: string;
  image?: string;
  description?: string;
  short_description?: string;
  stock: boolean;
  stock_count?: number;
  sku?: string;
  specs: ProductSpecs;
  faqs: ProductFAQ[];
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsParams {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  stock?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface BulkUploadResponse {
  created: number;
  errors?: { index: number; error: string }[];
}
