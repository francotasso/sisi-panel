"use client";

import { useState, useMemo } from "react";
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
import { MoreHorizontal, Pencil, Trash2, Search, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { useUsers } from "../hooks/use-users";
import { useDeleteUser } from "../hooks/use-delete-user";
import { useAuthStore } from "@/stores/auth-store";
import { UserFormDialog } from "./user-form-dialog";
import type { UserListItem } from "../types";
import { cn } from "@/lib/utils";

export function UsersTable() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [editingUser, setEditingUser] = useState<UserListItem | undefined>();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, search]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="hidden md:table-cell">Creado</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState icon="sparkles" title="Sin usuarios" description="No se encontraron usuarios con ese filtro." />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user, idx) => (
                  <TableRow
                    key={user.id}
                    className={cn(
                      "transition-colors",
                      idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-medium text-primary">
                            {(user.name ?? user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {user.name ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? "Admin" : "Editor"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>} />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setEditingUser(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {user.id !== currentUserId && (
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => {
                                if (confirm("¿Eliminar este usuario?")) {
                                  deleteUser.mutate(user.id);
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <UserFormDialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(undefined);
        }}
        user={editingUser}
      />
    </>
  );
}
