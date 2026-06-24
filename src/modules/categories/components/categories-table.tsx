"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2, Search, LayoutGrid, ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { useCategories } from "../hooks/use-categories";
import { useDeleteCategory } from "../hooks/use-delete-category";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CategoriesTable() {
  const router = useRouter();
  const { data, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const isEditor = useAuthStore((s) => {
    const u = s.user;
    return u?.role === "editor" || u?.user_metadata?.role === "editor";
  });
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];

    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.short_description?.toLowerCase().includes(q) ||
          String(c.id).toLowerCase().includes(q)
      );
    }

    return result;
  }, [data, search]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción corta</TableHead>
                {!isEditor && <TableHead className="w-[70px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                    {Array.from({ length: isEditor ? 2 : 3 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isEditor ? 3 : 4}>
                    <EmptyState icon="sparkles" title="Sin categorías" description="Creá una categoría para empezar." />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((category, idx) => (
                  <TableRow
                    key={category.id}
                    className={cn(
                      "transition-colors",
                      idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <TableCell>
                      {category.image ? (
                        <div className="relative h-8 w-8 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {category.short_description || "—"}
                    </TableCell>
                    {!isEditor && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>} />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/admin/categories/edit/${category.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => deleteCategory.mutate(category.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
