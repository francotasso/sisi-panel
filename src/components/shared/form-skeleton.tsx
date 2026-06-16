"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  fields?: number;
  rows?: number;
}

export function FormSkeleton({ fields = 3, rows = 1 }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: fields }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Skeleton className="h-8 w-32" />
    </div>
  );
}
