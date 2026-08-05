"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserSchema, CreateUserSchema } from "../schemas/user.schema";
import { createUserAction } from "../actions/user.actions";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "publisher",
    },
  });

  async function onSubmit(values: CreateUserSchema) {
    setIsPending(true);
    try {
      const res = await createUserAction(values);
      if (res.success) {
        toast.success("Usuario creado exitosamente");
        setOpen(false);
        form.reset();
      } else {
        toast.error(res.error || "Hubo un error al crear el usuario");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-xl px-5 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="w-4 h-4 mr-2" />
          Crear Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <SparklesIcon className="size-4" />
            </div>
            <DialogTitle className="text-xl font-extrabold tracking-tight">Crear Nuevo Usuario</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Agrega una nueva cuenta de acceso a la plataforma con su rol correspondiente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Juan Pérez" className="h-10 rounded-xl border-border/60 focus-visible:ring-primary/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ejemplo@screenhub.com" className="h-10 rounded-xl border-border/60 focus-visible:ring-primary/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo 8 caracteres" className="h-10 rounded-xl border-border/60 focus-visible:ring-primary/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rol de Acceso</FormLabel>
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
              <Button type="button" variant="outline" className="rounded-xl font-semibold" onClick={() => setOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl font-bold bg-primary text-primary-foreground shadow-md hover:bg-primary/90" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Crear Usuario
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
