"use client";

import { FileX, Package, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "default" | "product" | "sparkles";
  children?: ReactNode;
}

const icons = {
  default: FileX,
  product: Package,
  sparkles: Sparkles,
};

export function EmptyState({
  title = "No hay datos",
  description = "No se encontraron registros.",
  icon = "default",
  children,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10">
        <Icon className="h-6 w-6 text-primary/60" />
      </div>
      <h3 className="text-lg font-heading font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
