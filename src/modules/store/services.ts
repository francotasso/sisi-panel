import { apiClient } from "@/lib/api-client";
import type { Store, StoreFormData } from "./types";

export const storeService = {
  get: () =>
    apiClient.get<Store>("/store"),

  create: (data: StoreFormData) =>
    apiClient.post<Store>("/store", data),

  update: (data: StoreFormData) =>
    apiClient.put<Store>("/store", data),
};
