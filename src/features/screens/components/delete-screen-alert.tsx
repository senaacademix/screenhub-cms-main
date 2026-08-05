"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertTriangleIcon } from "lucide-react";
import { Screen } from "@/generated/prisma";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteScreenAction } from "../actions/screen.actions";
import { Button } from "@/components/ui/button";

interface DeleteScreenAlertProps {
  screen: Screen | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteScreenAlert({ screen, open, onOpenChange }: DeleteScreenAlertProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!screen) return;
    
    setIsPending(true);
    try {
      const res = await deleteScreenAction(screen.id);
      if (res.success) {
        toast.success("Pantalla eliminada exitosamente");
        onOpenChange(false);
      } else {
        toast.error(res.error || "Hubo un error al eliminar la pantalla");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] rounded-2xl border border-red-500/30 bg-card/95 backdrop-blur-md shadow-2xl">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
              <AlertTriangleIcon className="size-4" />
            </div>
            <AlertDialogTitle className="text-xl font-extrabold tracking-tight">¿Eliminar Pantalla?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Se desvinculará la pantalla <strong className="text-foreground">{screen?.name}</strong> de la red. La URL del reproductor cliente dejará de estar disponible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-3 gap-2">
          <Button variant="outline" className="rounded-xl font-semibold" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" className="rounded-xl font-bold" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Eliminar Pantalla
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
