"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { getToken } from "@/lib/auth";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && requireAuth) {
      if (!isAuthenticated) {
        const storedToken = getToken();
        if (storedToken) {
          useAuthStore.setState({ isAuthenticated: true });
        } else {
          router.replace("/login");
        }
      }
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  return { user, isLoading, isAuthenticated, logout };
}
