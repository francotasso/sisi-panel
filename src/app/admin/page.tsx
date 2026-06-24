"use client";

import { Package, LayoutGrid, Store, Star, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useProducts } from "@/modules/products/hooks/use-products";
import { useCategories } from "@/modules/categories/hooks/use-categories";
import { useTestimonials } from "@/modules/testimonials/hooks/use-testimonials";
import Link from "next/link";
import Image from "next/image";

const statCards = [
  { title: "Productos", icon: Package, href: "/admin/products", color: "text-primary bg-primary/10" },
  { title: "Categorías", icon: LayoutGrid, href: "/admin/categories", color: "text-[oklch(0.55_0.18_15)] bg-[oklch(0.55_0.18_15)]/10" },
  { title: "Testimonios", icon: Star, href: "/admin/testimonials", color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30" },
  { title: "Tienda", icon: Store, href: "/admin/store", color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30" },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 10, sort_by: "created_at", sort_order: "desc" });
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();

  const productCount = productsData?.total ?? 0;
  const recentProducts = productsData?.items?.slice(0, 5) ?? [];
  const categoryCount = categories?.length ?? 0;
  const testimonialCount = testimonials?.length ?? 0;

  const isLoading = productsLoading || categoriesLoading || testimonialsLoading;

  const greetingName = user?.email?.split("@")[0] ?? "Usuario";

  const statValues = [
    { value: productCount, loading: productsLoading },
    { value: categoryCount, loading: categoriesLoading },
    { value: testimonialCount, loading: testimonialsLoading },
    { value: "—", loading: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">
            Hola, <span className="capitalize text-primary">{greetingName}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Resumen de tu tienda
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Link key={stat.title} href={stat.href} className="group">
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                {statValues[i].loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{statValues[i].value}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Productos recientes</CardTitle>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay productos aún.
            </p>
          ) : (
            <div className="divide-y">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {product.image ? (
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate">{product.name}</span>
                      {product.best_seller && (
                        <Badge variant="ghost" className="bg-amber-500 hover:bg-amber-600 text-white dark:text-white text-[10px] px-1.5 py-0 shrink-0">
                          Best seller
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-sm text-muted-foreground">
                      {product.discount_price ? (
                        <span className="flex items-center gap-1.5">
                          <span className="line-through">S/{Number(product.price).toFixed(2)}</span>
                          <span className="text-destructive font-medium">S/{Number(product.discount_price).toFixed(2)}</span>
                        </span>
                      ) : (
                        <>S/{Number(product.price).toFixed(2)}</>
                      )}
                    </span>
                    <Badge variant={product.stock ? "default" : "secondary"} className="text-[10px]">
                      {product.stock ? "Disponible" : "Sin stock"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
