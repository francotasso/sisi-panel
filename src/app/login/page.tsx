"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("expired")) {
        toast.error("Sesión expirada", { duration: 5000 });
        window.history.replaceState({}, "", "/login");
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && getToken()) {
      window.location.href = "/admin";
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Inicio de sesión exitoso");
      window.location.href = "/admin";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-[oklch(0.97_0.02_15)] to-[oklch(0.95_0.04_15)] dark:from-background dark:via-[oklch(0.15_0.02_15)] dark:to-[oklch(0.12_0.03_15)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.63_0.18_15/0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,oklch(0.75_0.14_15/0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.73_0.15_15/0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.63_0.18_15/0.08),transparent_50%)]" />

      <Card className="relative w-full max-w-sm animate-scale-in shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading">Sisi Panel</CardTitle>
          <CardDescription>Inicia sesión para administrar tu tienda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
