"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Loader2, 
  EditIcon, 
  CalendarIcon, 
  TvIcon, 
  FolderIcon, 
  ClockIcon, 
  FilterIcon,
  CheckCircle2Icon,
  SparklesIcon,
  VideoIcon,
  ImageIcon,
  FileTextIcon,
  GlobeIcon
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Screen, Publication, ContentItem, ScheduleItem } from "@/generated/prisma";
import { createScheduleSchema, CreateScheduleSchema } from "../schemas/schedule.schema";
import { updateScheduleItemAction } from "../actions/schedule.actions";

interface PublicationWithDetails extends Publication {
  contents: ContentItem[];
  createdBy?: { name: string | null } | null;
}

interface ScheduleWithDetails extends ScheduleItem {
  publication: PublicationWithDetails;
  screen?: Screen;
}

interface EditScheduleDialogProps {
  scheduleItem: ScheduleWithDetails | null;
  screens: Screen[];
  publishedPublications: PublicationWithDetails[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAYS_OPTIONS = [
  { id: "1", label: "L", full: "Lunes" },
  { id: "2", label: "M", full: "Martes" },
  { id: "3", label: "X", full: "Miércoles" },
  { id: "4", label: "J", full: "Jueves" },
  { id: "5", label: "V", full: "Viernes" },
  { id: "6", label: "S", full: "Sábado" },
  { id: "0", label: "D", full: "Domingo" },
];

export function EditScheduleDialog({ scheduleItem, screens, publishedPublications, open, onOpenChange }: EditScheduleDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(["ALL"]);
  const [publisherFilter, setPublisherFilter] = useState<string>("ALL");

  const form = useForm<CreateScheduleSchema>({
    resolver: zodResolver(createScheduleSchema) as any,
    defaultValues: {
      screenId: "",
      publicationId: "",
      startTime: "00:00",
      endTime: "23:59",
      daysOfWeek: "ALL",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (scheduleItem) {
      const daysStr = scheduleItem.daysOfWeek || "ALL";
      const daysArr = daysStr === "ALL" ? ["ALL"] : daysStr.split(",");
      setSelectedDays(daysArr);

      form.reset({
        screenId: scheduleItem.screenId,
        publicationId: scheduleItem.publicationId,
        startTime: scheduleItem.startTime || "00:00",
        endTime: scheduleItem.endTime || "23:59",
        daysOfWeek: daysStr,
        startDate: scheduleItem.startDate ? new Date(scheduleItem.startDate).toISOString().slice(0, 10) : "",
        endDate: scheduleItem.endDate ? new Date(scheduleItem.endDate).toISOString().slice(0, 10) : "",
      });
    }
  }, [scheduleItem, form]);

  const selectedScreenId = form.watch("screenId");
  const selectedPubId = form.watch("publicationId");
  const activePublication = publishedPublications.find((p) => p.id === selectedPubId) || scheduleItem?.publication;

  // Extract unique publishers list
  const publishersList = Array.from(
    new Set(publishedPublications.map((p) => p.createdBy?.name || "Publicador"))
  );

  const filteredPublications = publisherFilter === "ALL"
    ? publishedPublications
    : publishedPublications.filter((p) => (p.createdBy?.name || "Publicador") === publisherFilter);

  const toggleDay = (dayId: string) => {
    if (dayId === "ALL") {
      setSelectedDays(["ALL"]);
      form.setValue("daysOfWeek", "ALL");
      return;
    }

    let newDays = selectedDays.filter((d) => d !== "ALL");
    if (newDays.includes(dayId)) {
      newDays = newDays.filter((d) => d !== dayId);
    } else {
      newDays.push(dayId);
    }

    if (newDays.length === 0 || newDays.length === 7) {
      setSelectedDays(["ALL"]);
      form.setValue("daysOfWeek", "ALL");
    } else {
      setSelectedDays(newDays);
      form.setValue("daysOfWeek", newDays.join(","));
    }
  };

  const onSubmit = async (values: CreateScheduleSchema) => {
    if (!scheduleItem) return;
    setIsPending(true);
    try {
      const res = await updateScheduleItemAction(scheduleItem.id, values);
      if (res.success) {
        toast.success("¡Programación actualizada exitosamente!");
        onOpenChange(false);
      } else {
        toast.error(res.error || "No se pudo actualizar la programación");
      }
    } catch {
      toast.error("Ocurrió un error inesperado al guardar");
    } finally {
      setIsPending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <VideoIcon className="size-3.5 text-emerald-400" />;
      case "text": return <FileTextIcon className="size-3.5 text-amber-400" />;
      case "web": return <GlobeIcon className="size-3.5 text-sky-400" />;
      default: return <ImageIcon className="size-3.5 text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-screen h-screen max-h-screen fixed inset-0 translate-x-0 translate-y-0 rounded-none border-none p-0 flex flex-col bg-background/95 backdrop-blur-2xl overflow-hidden z-50">
        
        {/* Fullscreen Header */}
        <div className="h-16 px-6 sm:px-8 border-b border-border/60 flex items-center justify-between bg-card/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <EditIcon className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                Editar Parámetros de Programación
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Modifica la pantalla asignada, la publicación o ajusta las franjas horarias de transmisión.
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="rounded-xl font-bold px-4 h-10 border-border/80" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              size="sm"
              onClick={form.handleSubmit(onSubmit, (errors) => {
                const firstError = Object.values(errors)[0]?.message as string;
                toast.error(firstError || "Por favor verifica los campos obligatorios");
              })} 
              disabled={isPending}
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 px-6 h-10"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </div>

        {/* 2-Column Fullscreen Studio Grid */}
        <div className="flex-1 h-[calc(100vh-4rem)] p-4 sm:p-6 grid grid-cols-12 gap-6 bg-muted/10 overflow-hidden">
          
          {/* Left Column: Selección de Publicaciones & Filtro por Publicador (7 Cols) */}
          <div className="col-span-12 lg:col-span-7 h-full flex flex-col bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-7 shadow-md backdrop-blur-xl overflow-hidden">
            
            {/* Publisher Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <FolderIcon className="size-4 text-amber-400" />
                <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                  1. Cambiar Publicación Aprobada
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold shrink-0 flex items-center gap-1">
                  <FilterIcon className="size-3 text-primary" /> Publicador:
                </span>
                <Select value={publisherFilter} onValueChange={setPublisherFilter}>
                  <SelectTrigger className="h-9 w-52 rounded-xl text-xs font-bold border-border/60 bg-background">
                    <SelectValue placeholder="Todos los publicadores" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border/80">
                    <SelectItem value="ALL" className="rounded-lg text-xs py-1.5 font-bold">
                      👥 Todos los Publicadores ({publishedPublications.length})
                    </SelectItem>
                    {publishersList.map((pubName) => (
                      <SelectItem key={pubName} value={pubName} className="rounded-lg text-xs py-1.5 font-medium">
                        👤 {pubName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Published Publications Selection List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {filteredPublications.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-2xl text-muted-foreground">
                  <FolderIcon className="size-12 text-muted-foreground/30 mb-2" />
                  <p className="text-sm font-bold text-foreground">No hay publicaciones aprobadas para este filtro.</p>
                </div>
              ) : (
                filteredPublications.map((pub) => {
                  const isSelected = selectedPubId === pub.id;
                  return (
                    <div
                      key={pub.id}
                      onClick={() => form.setValue("publicationId", pub.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-md shadow-primary/10 ring-1 ring-primary"
                          : "bg-background/60 border-border/50 hover:bg-accent/40 hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-xl flex items-center justify-center ${
                            isSelected 
                              ? "bg-primary text-primary-foreground font-bold" 
                              : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          }`}>
                            <FolderIcon className="size-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">{pub.title}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>Por: <strong className="text-primary font-bold">{pub.createdBy?.name || "Publicador"}</strong></span>
                              <span>•</span>
                              <span>{pub.contents.length} diapositivas</span>
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-black shadow-sm">
                            <CheckCircle2Icon className="size-3.5" /> Seleccionada
                          </span>
                        )}
                      </div>

                      {/* Internal Contents Preview Badges */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-border/30">
                        <span className="text-[11px] font-bold text-muted-foreground mr-1">Diapositivas:</span>
                        {pub.contents.map((item) => (
                          <span key={item.id} title={item.title} className="size-6 rounded-md bg-muted/60 border border-border/40 flex items-center justify-center">
                            {getTypeIcon(item.type)}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selección de Pantalla Objetivo & Franja Horaria (5 Cols) */}
          <div className="col-span-12 lg:col-span-5 h-full flex flex-col bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-7 shadow-md backdrop-blur-xl overflow-hidden justify-between">
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 overflow-y-auto pr-1">
                
                {/* Paso 2: Seleccionar Pantalla Objetivo */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TvIcon className="size-4 text-primary" />
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                      2. Cambiar Pantalla Objetivo
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="screenId"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-border/60 focus:ring-primary/40 font-bold text-xs bg-background">
                              <SelectValue placeholder="Selecciona la pantalla..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border border-border/80">
                            {screens.map((sc) => (
                              <SelectItem key={sc.id} value={sc.id} className="rounded-lg text-xs py-2 font-medium">
                                📺 {sc.name} — <span className="text-muted-foreground">{sc.location} ({sc.orientation.toUpperCase()})</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Paso 3: Franja Horaria de Emisión */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="size-4 text-emerald-400" />
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                      3. Franja Horaria & Días
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-muted-foreground">Hora de Inicio</FormLabel>
                          <FormControl>
                            <Input type="time" className="h-10 rounded-xl font-mono text-xs bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-muted-foreground">Hora de Fin</FormLabel>
                          <FormControl>
                            <Input type="time" className="h-10 rounded-xl font-mono text-xs bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Selector de Días */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground block">Días de Transmisión Activos</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleDay("ALL")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedDays.includes("ALL")
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-card border-border/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        Todos los Días
                      </button>

                      {DAYS_OPTIONS.map((day) => {
                        const isSelected = !selectedDays.includes("ALL") && selectedDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className={`size-8 rounded-xl text-xs font-bold border flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                                : "bg-card border-border/60 text-muted-foreground hover:bg-muted"
                            }`}
                            title={day.full}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Resumen de Programación */}
                {activePublication && selectedScreenId && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                      <SparklesIcon className="size-4 animate-pulse" />
                      <span>Parámetros Actualizados</span>
                    </div>
                    <p className="text-foreground font-bold">
                      "{activePublication.title}" ➔ {screens.find((s) => s.id === selectedScreenId)?.name}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Emisión: <strong className="text-emerald-400 font-mono">{form.watch("startTime")} - {form.watch("endTime")}</strong>
                    </p>
                  </div>
                )}
              </form>
            </Form>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
