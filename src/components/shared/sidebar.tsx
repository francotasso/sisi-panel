"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  LayoutGrid,
  Store,
  Star,
  LayoutDashboard,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Productos", href: "/admin/products", icon: Package },
  { name: "Categorías", href: "/admin/categories", icon: LayoutGrid },
  { name: "Usuarios", href: "/admin/users", icon: Users, adminOnly: true },
  { name: "Tienda", href: "/admin/store", icon: Store },
  { name: "Testimonios", href: "/admin/testimonials", icon: Star },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isAdmin =
    user?.role === "admin" || user?.user_metadata?.role === "admin";

  const visibleNav = navigation.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const nav = (
    <>
      <div className="flex h-14 items-center justify-between border-b px-6">
        <span className="text-base font-heading font-semibold tracking-tight text-primary">
          Sisi Panel
        </span>
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 p-3" onClick={onClose}>
        {visibleNav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {isActive && (
                <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isActive && "text-primary"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3" onClick={onClose}>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-card">
        {nav}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside
            className={cn(
              "fixed inset-y-0 left-0 flex w-64 flex-col border-r bg-card shadow-xl transition-transform duration-300 ease-out",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
