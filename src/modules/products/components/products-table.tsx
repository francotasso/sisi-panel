"use client";

import { useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Package,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BulkUploadButton } from "./bulk-upload-button";
import { DownloadJsonButton } from "./download-json-button";
import { useProducts } from "../hooks/use-products";
import { useDeleteProduct } from "../hooks/use-delete-product";
import type { ProductsParams } from "../types";
import type { Category } from "@/modules/categories/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProductsTableProps {
  categories: Category[];
}

export function ProductsTable({ categories }: ProductsTableProps) {
  const router = useRouter();
  const [params, setParams] = useState<ProductsParams>({
    skip: 0,
    limit: 10,
    sort_by: "name",
    sort_order: "asc",
  });
  const [search, setSearch] = useState("");

  const { data, isLoading } = useProducts(params);
  const deleteProduct = useDeleteProduct();

  const handleSearch = useCallback(() => {
    setParams((prev) => ({ ...prev, search, skip: 0 }));
  }, [search]);

  const handleSort = (column: string) => {
    setParams((prev) => ({
      ...prev,
      sort_by: column,
      sort_order: prev.sort_by === column && prev.sort_order === "asc" ? "desc" : "asc",
    }));
  };

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => handleSort(column)}
      >
        {children}
        <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", params.sort_by === column && params.sort_order === "desc" && "rotate-180")} />
      </Button>
    </TableHead>
  );

  const page = data ? Math.floor(data.skip / data.limit) + 1 : 1;
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const goToPage = (p: number) => {
    setParams((prev) => ({ ...prev, skip: (p - 1) * prev.limit! }));
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-8 w-full"
            />
          </div>
        </div>
        <Select
          value={params.category ?? "all"}
          onValueChange={(value) => {
            if (value === null) return;
            setParams((prev) => ({ ...prev, category: value === "all" ? undefined : value, skip: 0 }));
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría">
              {!params.category ? "Todas" : categories.find((c) => (c.slug ?? String(c.id)) === params.category)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug ?? String(cat.id)}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={params.stock === undefined ? "all" : String(params.stock)}
          onValueChange={(value) =>
            setParams((prev) => ({
              ...prev,
              stock: value === "all" ? undefined : value === "true",
              skip: 0,
            }))
          }
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Stock">
              {params.stock === true ? "Disponible" : params.stock === false ? "Sin stock" : "Todos"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Disponible</SelectItem>
            <SelectItem value="false">Sin stock</SelectItem>
          </SelectContent>
        </Select>
        <BulkUploadButton />
        <DownloadJsonButton />
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[40px]"></TableHead>
                <SortableHeader column="name">Nombre</SortableHeader>
                <SortableHeader column="price">Precio</SortableHeader>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (data?.items?.length ?? 0) === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <EmptyState icon="product" />
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((product, idx) => (
                  <TableRow
                    key={product.id ?? product.slug ?? idx}
                    className={cn(
                      "transition-colors",
                      idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <TableCell>
                      {product.image ? (
                        <div className="relative h-8 w-8 overflow-hidden rounded-md border">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.name}
                        {product.best_seller && (
                          <Badge variant="ghost" className="bg-amber-500 hover:bg-amber-600 text-white dark:text-white text-[10px] px-1.5 py-0">
                            Best seller
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.discount_price ? (
                        <div className="flex items-center gap-1.5">
                          <span className="line-through text-muted-foreground">S/{Number(product.price).toFixed(2)}</span>
                          <span className="text-destructive font-medium">S/{Number(product.discount_price).toFixed(2)}</span>
                        </div>
                      ) : (
                        <span>S/{Number(product.price).toFixed(2)}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {product.sku || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category_name ?? product.category_id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", product.stock ? "bg-emerald-500" : "bg-destructive")} />
                        <span className="text-sm">{product.stock ? "Disponible" : "Sin stock"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>} />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/admin/products/edit/${product.slug ?? product.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => deleteProduct.mutate(product.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {data && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
            <span className="hidden sm:inline"> &mdash; {data.total} resultados</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((p, i) =>
              p === "ellipsis" ? (
                <span key={`e-${i}`} className="px-1 text-muted-foreground">...</span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => goToPage(p)}
                  className={p === page ? "" : ""}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
