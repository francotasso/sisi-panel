import { apiClient } from "@/lib/api-client";
import type { RegisterUserPayload, UpdateUserPayload, UserListItem } from "./types";

export const usersService = {
  register: (data: RegisterUserPayload) =>
    apiClient.post<UserListItem>("/auth/register", data),

  getAll: () =>
    apiClient.get<{ users: UserListItem[] }>("/auth/users"),

  update: (id: string, data: UpdateUserPayload) =>
    apiClient.put<UserListItem>(`/auth/users/${id}`, data),

  remove: (id: string) =>
    apiClient.delete<void>(`/auth/users/${id}`),
};
