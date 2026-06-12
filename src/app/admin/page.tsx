"use client";

import { Package, LayoutGrid, Store, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "Productos", value: "—", icon: Package, href: "/admin/products" },
  { title: "Categorías", value: "—", icon: LayoutGrid, href: "/admin/categories" },
  { title: "Tienda", value: "—", icon: Store, href: "/admin/store" },
  { title: "Testimonios", value: "—", icon: Star, href: "/admin/testimonials" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
