"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, PlusIcon, FolderPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { createPublicationSchema, CreatePublicationSchema } from "../schemas/publication.schema";
import { createPublicationAction } from "../actions/publication.actions";

export function CreatePublicationDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreatePublicationSchema>({
    resolver: zodResolver(createPublicationSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: CreatePublicationSchema) => {
    setIsPending(true);
    try {
      const res = await createPublicationAction(values);
      if (res.success) {
        toast.success("¡Publicación creada exitosamente en borrador!");
        form.reset();
        setOpen(false);
      } else {
        toast.error(res.error || "No se pudo crear la publicación");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 px-5 gap-2">
          <FolderPlusIcon className="size-4" />
          Nueva Publicación
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
            <FolderPlusIcon className="size-5 text-primary" />
            Crear Nueva Publicación
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Crea un contenedor de campaña. Luego podrás agregarle múltiples contenidos (imágenes, videos, avisos).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nombre / Título de la Publicación
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej. Campaña Promocional de Verano" 
                      className="h-11 rounded-xl text-xs font-medium" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Descripción / Propósito (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej. Anuncios para la sede principal" 
                      className="h-11 rounded-xl text-xs font-medium" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl font-bold">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl font-bold bg-primary text-primary-foreground">
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Crear Publicación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
