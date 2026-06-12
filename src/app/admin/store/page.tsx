"use client";

import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { StoreForm } from "@/modules/store/components/store-form";
import { useStore } from "@/modules/store/hooks/use-store";
import { useCreateStore } from "@/modules/store/hooks/use-create-store";
import { useUpdateStore } from "@/modules/store/hooks/use-update-store";
import type { StoreFormData } from "@/modules/store/types";

export default function StorePage() {
  const { data: store, isLoading } = useStore();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();

  const onSubmit = (data: StoreFormData) => {
    if (store) {
      updateStore.mutate(data);
    } else {
      createStore.mutate(data);
    }
  };

  const isSubmitting = createStore.isPending || updateStore.isPending;

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Tienda"
        description="Configuración de la tienda"
      />
      <StoreForm
        store={store}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
