"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useBulkUpload } from "../hooks/use-bulk-upload";

export function BulkUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const bulkUpload = useBulkUpload();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const body = Array.isArray(parsed) ? { items: parsed } : parsed;
      if (!body.items || !Array.isArray(body.items)) {
        throw new Error("El archivo debe contener un array de productos en la raíz o en la propiedad 'items'");
      }
      bulkUpload.mutate(body as Record<string, unknown>);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al leer el archivo";
      const { toast } = await import("sonner");
      toast.error(message);
    }

    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        disabled={bulkUpload.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {bulkUpload.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Subir JSON
      </Button>
    </>
  );
}
