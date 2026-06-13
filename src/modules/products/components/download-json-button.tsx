"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { productsService } from "../services";
import { toast } from "sonner";

export function DownloadJsonButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await productsService.exportAll();
      const data = { items: response.items };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "productos.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Productos exportados exitosamente");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al exportar productos"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto"
      disabled={isDownloading}
      onClick={handleDownload}
    >
      {isDownloading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Descargar JSON
    </Button>
  );
}
