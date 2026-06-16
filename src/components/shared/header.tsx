"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Menu, Search, LogOut, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenCommand?: () => void;
}

const routeNames: Record<string, string> = {
  "": "Dashboard",
  products: "Productos",
  categories: "Categorías",
  users: "Usuarios",
  store: "Tienda",
  testimonials: "Testimonios",
  create: "Nuevo",
  edit: "Editar",
};

function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.replace("/admin", "").split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {segments.map((segment, i) => {
        const label = routeNames[segment] ?? segment;
        const isLast = i === segments.length - 1;
        return (
          <span key={segment} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground/40">/</span>}
            <span
              className={cn(
                "truncate max-w-[100px] sm:max-w-none",
                isLast ? "font-medium text-foreground" : ""
              )}
            >
              {label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}

export function Header({ onToggleSidebar, onOpenCommand }: HeaderProps) {
  const { user, logout } = useAuthStore();

  const initials = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-card px-4 sm:px-6">
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Breadcrumb />

      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex gap-1.5 text-muted-foreground"
          aria-label="Buscar"
          onClick={onOpenCommand}
        >
          <Search className="h-4 w-4" />
          <span className="text-xs text-muted-foreground/60 flex items-center gap-0.5">
            <Command className="h-3 w-3" />K
          </span>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm text-muted-foreground max-w-32 truncate">
                {user?.email}
              </span>
            </Button>}
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{user?.email}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user?.role ?? "Usuario"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} variant="destructive">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
