"use client";

import { useState, ReactNode } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { CommandPalette } from "@/components/shared/command-palette";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onOpenCommand={() => setCommandOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6 lg:p-8 animate-fade-in">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
