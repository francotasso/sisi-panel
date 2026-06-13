import { apiClient } from "@/lib/api-client";
import type { BulkUploadResponse, ExportResponse, Product, ProductFormData, ProductsParams, ProductsResponse } from "./types";

export const productsService = {
  getAll: (params?: ProductsParams) =>
    apiClient.get<ProductsResponse>("/products", { params: params as Record<string, string | number | undefined> }),

  getBySlug: (slug: string) =>
    apiClient.get<Product>(`/products/${slug}`),

  create: (data: ProductFormData) =>
    apiClient.post<Product>("/products", data),

  update: (id: string, data: ProductFormData) =>
    apiClient.put<Product>(`/products/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/products/${id}`),

  bulkUpload: (data: Record<string, unknown>) =>
    apiClient.post<BulkUploadResponse>("/products/bulk", data),

  bulkReplace: (data: Record<string, unknown>) =>
    apiClient.put<BulkUploadResponse>("/products/bulk", data),

  exportAll: () =>
    apiClient.get<ExportResponse>("/products/export"),
};
