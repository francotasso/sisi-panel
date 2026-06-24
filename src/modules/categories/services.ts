import { apiClient } from "@/lib/api-client";
import type { Category, CategoryFormData } from "./types";

export const categoriesService = {
  getAll: () =>
    apiClient.get<Category[]>("/categories"),

  getById: (id: string) =>
    apiClient.get<Category>(`/categories/${id}`),

  create: (data: CategoryFormData) =>
    apiClient.post<Category>("/categories", data),

  update: (id: string, data: CategoryFormData) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/categories/${id}`),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.uploadFile<Category>(`/categories/${id}/image`, formData);
  },
};
