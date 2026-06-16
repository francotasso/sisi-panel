"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
      className="relative overflow-hidden"
    >
      <span className="relative z-10">
        {theme === "light" ? (
          <Moon className="h-4 w-4 transition-transform duration-300" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-300" />
        )}
      </span>
      <span className={cn(
        "absolute inset-0 rounded-full transition-opacity duration-300",
        theme === "light" ? "opacity-0" : "opacity-100 bg-primary/5"
      )} />
    </Button>
  );
}
