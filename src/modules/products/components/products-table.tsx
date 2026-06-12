"use client";

import { useState } from "react";
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
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Plus,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BulkUploadButton } from "./bulk-upload-button";
import { useProducts } from "../hooks/use-products";
import { useDeleteProduct } from "../hooks/use-delete-product";
import type { ProductsParams } from "../types";
import type { Category } from "@/modules/categories/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const handleSearch = () => {
    setParams((prev) => ({ ...prev, search, skip: 0 }));
  };

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
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  const page = data ? Math.floor(data.skip / data.limit) + 1 : 1;
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full sm:max-w-xs"
          />
          <Button variant="secondary" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={params.category ?? "all"}
          onValueChange={(value) => {
            if (value === null) return;
            setParams((prev) => ({ ...prev, category: value === "all" ? undefined : value, skip: 0 }));
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
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
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Disponible</SelectItem>
            <SelectItem value="false">Sin stock</SelectItem>
          </SelectContent>
        </Select>
        <BulkUploadButton />
        <Link href="/admin/products/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="name">Nombre</SortableHeader>
              <SortableHeader column="price">Precio</SortableHeader>
              <TableHead>SKU</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (data?.items?.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {product.name}
                      {product.best_seller && (
                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] px-1.5 py-0">
                          Best seller
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.discount_price ? (
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-muted-foreground">${Number(product.price).toFixed(2)}</span>
                        <span className="text-destructive font-medium">${Number(product.discount_price).toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${Number(product.price).toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.sku ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.category_name ?? product.category_id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.stock ? (
                      <Badge variant="default">Disponible</Badge>
                    ) : (
                      <Badge variant="secondary">Sin stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.stock_count ?? "—"}
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

      {data && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages} ({data.total} resultados)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setParams((prev) => ({ ...prev, skip: prev.skip! - prev.limit! }))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setParams((prev) => ({ ...prev, skip: prev.skip! + prev.limit! }))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
