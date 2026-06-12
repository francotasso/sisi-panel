"use client";

import { AdminLayout } from "@/components/shared/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/shared/loading-state";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth(true);

  if (isLoading) return <LoadingState />;
  if (!isAuthenticated) return null;

  return <AdminLayout>{children}</AdminLayout>;
}
