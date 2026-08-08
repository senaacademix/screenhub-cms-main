"use client";

import { useState } from "react";
import { Screen, Publication, ContentItem, ScheduleItem, User } from "@/generated/prisma";
import { CreateScheduleDialog } from "./create-schedule-dialog";
import { EditScheduleDialog } from "./edit-schedule-dialog";
import { 
  removeScheduleItemAction, 
  toggleScheduleActiveAction 
} from "../actions/schedule.actions";
import { 
  TvIcon, 
  Trash2Icon, 
  EditIcon,
  PowerIcon, 
  SparklesIcon, 
  ClockIcon, 
  UserIcon, 
  EyeIcon, 
  VideoIcon,
  ImageIcon,
  FileTextIcon,
  GlobeIcon,
  MapPinIcon,
  FolderIcon,
  CalendarDaysIcon,
  FilterIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type PublicationWithDetails = Publication & {
  createdBy?: User | null;
  contents: ContentItem[];
};

export type ScheduleWithDetails = ScheduleItem & {
  publication: PublicationWithDetails;
};

export type ScreenWithSchedules = Screen & {
  schedules: ScheduleWithDetails[];
};

interface AdminSchedulePageProps {
  screens: ScreenWithSchedules[];
  publishedPublications: PublicationWithDetails[];
}

export function AdminSchedulePage({ screens, publishedPublications }: AdminSchedulePageProps) {
  const [filterScreenId, setFilterScreenId] = useState<string>("ALL");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleWithDetails | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const handleEditClick = (sch: ScheduleWithDetails) => {
    setEditingSchedule(sch);
    setIsEditOpen(true);
  };

  // Flatten all schedules across all screens into a single master array
  const allSchedules = screens.flatMap((sc) =>
    sc.schedules.map((sch) => ({
      ...sch,
      screen: sc,
    }))
  );

  const displayedSchedules = filterScreenId === "ALL"
    ? allSchedules
    : allSchedules.filter((sch) => sch.screenId === filterScreenId);

  const handleRemoveScheduleItem = async (scheduleItemId: string) => {
    setRemovingId(scheduleItemId);
    try {
      const res = await removeScheduleItemAction(scheduleItemId);
      if (res.success) {
        toast.success("Publicación quitada de la programación");
      } else {
        toast.error(res.error || "No se pudo quitar la publicación");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setRemovingId(null);
    }
  };

  const handleToggleActive = async (scheduleItemId: string, currentActive: boolean) => {
    try {
      const res = await toggleScheduleActiveAction(scheduleItemId, !currentActive);
      if (res.success) {
        toast.success(!currentActive ? "Transmisión activada para la pantalla" : "Transmisión pausada");
      } else {
        toast.error(res.error || "No se pudo actualizar el estado");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
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

  const formatDaysLabel = (daysOfWeek?: string | null) => {
    if (!daysOfWeek || daysOfWeek === "ALL") return "Todos los días";
    const dayMap: Record<string, string> = {
      "1": "Lun", "2": "Mar", "3": "Mié", "4": "Jue", "5": "Vie", "6": "Sáb", "0": "Dom"
    };
    return daysOfWeek.split(",").map((d) => dayMap[d] || d).join(", ");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Programación Global de Emisión</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <SparklesIcon className="size-3" />
              Administración
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Gestión unificada de secuencias de emisión, franjas horarias y asignación de publicaciones en pantallas.
          </p>
        </div>

        <div>
          <CreateScheduleDialog 
            screens={screens} 
            publishedPublications={publishedPublications} 
          />
        </div>
      </div>

      {/* Options & Screen Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/70 border border-border/60 p-4 rounded-2xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center">
            <FilterIcon className="size-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Filtrar por Pantalla Objetivo
            </span>
            <span className="text-xs font-medium text-foreground">
              Mostrando <strong className="text-primary">{displayedSchedules.length}</strong> programaciones
            </span>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <Select value={filterScreenId} onValueChange={setFilterScreenId}>
            <SelectTrigger className="h-10 rounded-xl border-border/60 font-semibold text-xs bg-background">
              <SelectValue placeholder="Todas las pantallas" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border/80">
              <SelectItem value="ALL" className="rounded-lg text-xs py-2 font-bold">
                📺 Todas las Pantallas ({allSchedules.length})
              </SelectItem>
              {screens.map((sc) => (
                <SelectItem key={sc.id} value={sc.id} className="rounded-lg text-xs py-2 font-medium">
                  {sc.name} — {sc.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Unified Master Schedule Table */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">#</TableHead>
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pantalla Objetivo</TableHead>
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicación Programada</TableHead>
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Franja Horaria / Días</TableHead>
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicador Creador</TableHead>
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contenidos</TableHead>
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado Emisión</TableHead>
              <TableHead className="py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSchedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-muted-foreground font-medium">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <TvIcon className="size-10 text-muted-foreground/30" />
                    <p className="text-sm font-bold text-foreground">No hay programaciones registradas para el filtro seleccionado.</p>
                    <p className="text-xs text-muted-foreground">Haz clic en "+ Crear Programación" para asignar publicaciones a las pantallas.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayedSchedules.map((sch, index) => (
                <TableRow key={sch.id} className="transition-colors hover:bg-accent/40 border-b border-border/30 last:border-0">
                  <TableCell className="py-3 font-mono font-bold text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  {/* Pantalla Objetivo */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                        <TvIcon className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">{sch.screen.name}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <MapPinIcon className="size-3 text-primary" /> {sch.screen.location}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Publicación Programada */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <FolderIcon className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">{sch.publication.title}</span>
                        {sch.publication.description && (
                          <span className="text-[11px] text-muted-foreground line-clamp-1">{sch.publication.description}</span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Franja Horaria / Días */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono font-bold text-xs text-emerald-400 flex items-center gap-1">
                        <ClockIcon className="size-3 text-emerald-400 shrink-0" />
                        {sch.startTime || "00:00"} - {sch.endTime || "23:59"}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <CalendarDaysIcon className="size-3 text-muted-foreground shrink-0" />
                        {formatDaysLabel(sch.daysOfWeek)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Publicador Creador */}
                  <TableCell className="py-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      <UserIcon className="size-3" />
                      {sch.publication.createdBy?.name || "Publicador"}
                    </span>
                  </TableCell>

                  {/* Contenidos Internos */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      {sch.publication.contents.map((item) => (
                        <span key={item.id} title={item.title} className="size-6 rounded-md bg-muted/60 border border-border/40 flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </span>
                      ))}
                      <span className="text-xs font-bold text-muted-foreground ml-1">
                        ({sch.publication.contents.length})
                      </span>
                    </div>
                  </TableCell>

                  {/* Estado Emisión */}
                  <TableCell className="py-3">
                    <button
                      onClick={() => handleToggleActive(sch.id, sch.isActive)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                        sch.isActive
                          ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border border-muted bg-muted/40 text-muted-foreground opacity-60"
                      }`}
                    >
                      <PowerIcon className="size-3" />
                      <span>{sch.isActive ? "Activo" : "Pausado"}</span>
                    </button>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/screens/${sch.screen.slug}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver transmisión en vivo de esta pantalla"
                      >
                        <Button variant="ghost" size="sm" className="h-8 px-2 rounded-lg text-amber-400 hover:bg-amber-500/15 text-xs font-bold gap-1">
                          <EyeIcon className="size-3.5" />
                          <span className="hidden md:inline">Vista Previa</span>
                        </Button>
                      </a>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(sch)}
                        className="h-8 px-2 rounded-lg text-emerald-400 hover:bg-emerald-500/15 text-xs font-bold gap-1"
                        title="Editar parámetros de franja u horario"
                      >
                        <EditIcon className="size-3.5" />
                        <span className="hidden md:inline">Editar</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={removingId === sch.id}
                        onClick={() => handleRemoveScheduleItem(sch.id)}
                        className="h-8 w-8 p-0 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15"
                        title="Quitar de la programación"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditScheduleDialog 
        scheduleItem={editingSchedule}
        screens={screens}
        publishedPublications={publishedPublications}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
}
