"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, TvIcon, SparklesIcon } from "lucide-react";

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
import { createScreenSchema, CreateScreenSchema } from "../schemas/screen.schema";
import { createScreenAction } from "../actions/screen.actions";

import { User } from "@/generated/prisma";

interface CreateScreenDialogProps {
  publishers?: User[];
}

export function CreateScreenDialog({ publishers = [] }: CreateScreenDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateScreenSchema>({
    resolver: zodResolver(createScreenSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      location: "",
      description: "",
      status: "active",
      orientation: "landscape",
      resolution: "1920x1080",
      refreshRate: 30,
      publisherId: "unassigned",
    },
  });

  // Auto-generate slug when name changes if slug is empty or unedited
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    form.setValue("name", val);
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    form.setValue("slug", slugified);
  };

  async function onSubmit(values: CreateScreenSchema) {
    setIsPending(true);
    try {
      const res = await createScreenAction(values);
      if (res.success) {
        toast.success("Pantalla creada exitosamente");
        setOpen(false);
        form.reset();
      } else {
        toast.error(res.error || "Hubo un error al crear la pantalla");
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
          Nueva Pantalla
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <TvIcon className="size-4" />
            </div>
            <DialogTitle className="text-xl font-extrabold tracking-tight">Registrar Nueva Pantalla</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Configura un nuevo dispositivo receptor de cartelería digital para transmitir contenido.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre de Pantalla</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej. Recepción Principal" 
                        className="h-10 rounded-xl border-border/60 focus-visible:ring-primary/40" 
                        {...field}
                        onChange={handleNameChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Identificador (URL Slug)</FormLabel>
                    <FormControl>
                      <Input placeholder="recepcion-principal" className="h-10 rounded-xl border-border/60 focus-visible:ring-primary/40 font-mono text-xs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="publisherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicador Asignado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "unassigned"}>
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-xl border-border/60 focus:ring-primary/40">
                        <SelectValue placeholder="Selecciona un publicador (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border border-border/80">
                      <SelectItem value="unassigned" className="rounded-lg text-muted-foreground">Sin Publicador Asignado</SelectItem>
                      {publishers.map((pub) => (
                        <SelectItem key={pub.id} value={pub.id} className="rounded-lg font-medium">
                          {pub.name} ({pub.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ubicación Física</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Edificio A - Hall de Entrada, Piso 1" className="h-10 rounded-xl border-border/60 focus-visible:ring-primary/40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orientation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Orientación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-xl border-border/60 focus:ring-primary/40">
                          <SelectValue placeholder="Orientación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border border-border/80">
                        <SelectItem value="landscape" className="rounded-lg">Horizontal (Landscape 16:9)</SelectItem>
                        <SelectItem value="portrait" className="rounded-lg">Vertical (Portrait 9:16)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado Inicial</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-xl border-border/60 focus:ring-primary/40">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border border-border/80">
                        <SelectItem value="active" className="rounded-lg">Activa / En Línea</SelectItem>
                        <SelectItem value="offline" className="rounded-lg">Inactiva / Fuera de Línea</SelectItem>
                        <SelectItem value="maintenance" className="rounded-lg">Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descripción Opcional</FormLabel>
                  <FormControl>
                    <textarea 
                      placeholder="Ej. Pantalla LG 55 pulgadas enfocada a avisos institucionales." 
                      className="flex min-h-20 w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 resize-none" 
                      {...field} 
                    />
                  </FormControl>
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
                Guardar Pantalla
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
