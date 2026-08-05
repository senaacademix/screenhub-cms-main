"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertTriangleIcon } from "lucide-react";
import { User } from "@/generated/prisma";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUserAction } from "../actions/user.actions";
import { Button } from "@/components/ui/button";

interface DeleteUserAlertProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserAlert({ user, open, onOpenChange }: DeleteUserAlertProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!user) return;
    
    setIsPending(true);
    try {
      const res = await deleteUserAction(user.id);
      if (res.success) {
        toast.success("Usuario eliminado exitosamente");
        onOpenChange(false);
      } else {
        toast.error(res.error || "Hubo un error al eliminar el usuario");
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
            <AlertDialogTitle className="text-xl font-extrabold tracking-tight">¿Eliminar Usuario?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de <strong className="text-foreground">{user?.name}</strong> ({user?.email}) y se removerán todos sus permisos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-3 gap-2">
          <Button variant="outline" className="rounded-xl font-semibold" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" className="rounded-xl font-bold" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Eliminar Cuenta
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
