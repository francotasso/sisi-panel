"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersTable } from "@/modules/users/components/users-table";
import { UserFormDialog } from "@/modules/users/components/user-form-dialog";

export default function UsersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin" || user?.user_metadata?.role === "admin";
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (user && !isAdmin) router.replace("/admin");
  }, [user, isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div>
      <PageHeader title="Usuarios" description="Gestiona los usuarios del sistema">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo usuario
        </Button>
      </PageHeader>
      <UsersTable />
      <UserFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
