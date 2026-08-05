"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRoleSchema, UpdateUserRoleSchema } from "../schemas/user.schema";
import { updateUserRoleAction } from "../actions/user.actions";
import { User } from "@/generated/prisma";

interface EditRoleDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoleDialog({ user, open, onOpenChange }: EditRoleDialogProps) {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<UpdateUserRoleSchema>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: {
      role: "publisher",
    },
  });

  useEffect(() => {
    if (user?.role) {
      form.reset({ role: user.role as any });
    }
  }, [user, form]);

  async function onSubmit(values: UpdateUserRoleSchema) {
    if (!user) return;
    
    setIsPending(true);
    try {
      const res = await updateUserRoleAction(user.id, values);
      if (res.success) {
        toast.success("Rol actualizado exitosamente");
        onOpenChange(false);
      } else {
        toast.error(res.error || "Hubo un error al actualizar el rol");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <ShieldCheckIcon className="size-4" />
            </div>
            <DialogTitle className="text-xl font-extrabold tracking-tight">Cambiar Rol</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Modificando permisos de acceso para <strong className="text-foreground">{user?.name}</strong> ({user?.email}).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rol en el sistema</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-xl border-border/60 focus:ring-primary/40">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border border-border/80">
                      <SelectItem value="admin" className="rounded-lg">Administrador (Acceso Total)</SelectItem>
                      <SelectItem value="publisher" className="rounded-lg">Publicador (Gestión de Pantallas)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 space-x-2">
              <Button type="button" variant="outline" className="rounded-xl font-semibold" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl font-bold bg-primary text-primary-foreground shadow-md hover:bg-primary/90" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
