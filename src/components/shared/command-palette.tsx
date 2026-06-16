"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  Users,
  Store,
  Star,
  PlusCircle,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Escribí un comando o buscá..." />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Navegación">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/products"))}>
            <Package className="mr-2 h-4 w-4" />
            Productos
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/categories"))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            Categorías
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/users"))}>
            <Users className="mr-2 h-4 w-4" />
            Usuarios
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/store"))}>
            <Store className="mr-2 h-4 w-4" />
            Tienda
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/testimonials"))}>
            <Star className="mr-2 h-4 w-4" />
            Testimonios
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Acciones rápidas">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/products/create"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo producto
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/categories/create"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva categoría
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
