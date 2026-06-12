"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuthStore();

  const initials = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 sm:px-6">
      <button onClick={onToggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm text-muted-foreground">{user?.email}</span>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
