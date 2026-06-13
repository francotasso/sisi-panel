"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Loader2, Trash2, Plus } from "lucide-react";
import { useBulkUpload } from "../hooks/use-bulk-upload";

export function BulkUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<Record<string, unknown> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      setParsedData(body as Record<string, unknown>);
      setDialogOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al leer el archivo";
      const { toast } = await import("sonner");
      toast.error(message);
    }

    e.target.value = "";
  };

  const handleUpload = (mode: "replace" | "append") => {
    if (!parsedData) return;
    setDialogOpen(false);
    bulkUpload.mutate({ data: parsedData, mode });
    setParsedData(null);
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir productos</DialogTitle>
            <DialogDescription>
              {parsedData?.items
                ? `Se encontraron ${(parsedData.items as unknown[]).length} producto(s) en el archivo. ¿Cómo deseas subirlos?`
                : "Procesando archivo..."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => handleUpload("replace")}
              disabled={bulkUpload.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar todo y subir
            </Button>
            <Button
              variant="default"
              onClick={() => handleUpload("append")}
              disabled={bulkUpload.isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              Solo agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
