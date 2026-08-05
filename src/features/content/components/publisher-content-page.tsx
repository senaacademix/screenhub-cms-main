"use client";

import { useState } from "react";
import { ContentItem, Screen, User } from "@/generated/prisma";
import { CreateContentDialog } from "./create-content-dialog";
import { EditContentDialog } from "./edit-content-dialog";
import { deleteContentAction, toggleContentActiveAction } from "../actions/content.actions";
import { 
  TvIcon, 
  SparklesIcon, 
  LockIcon, 
  Trash2Icon, 
  EditIcon,
  PowerIcon, 
  ImageIcon, 
  VideoIcon, 
  FileTextIcon, 
  GlobeIcon, 
  ClockIcon, 
  MapPinIcon,
  CheckCircle2Icon,
  AlertTriangleIcon
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
import { toast } from "sonner";

export type ScreenWithContent = Screen & {
  publisher?: User | null;
  contents: ContentItem[];
};

interface PublisherContentPageProps {
  screens: ScreenWithContent[];
}

export function PublisherContentPage({ screens }: PublisherContentPageProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string>(screens[0]?.id || "");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Edit Dialog State
  const [selectedContentToEdit, setSelectedContentToEdit] = useState<ContentItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (item: ContentItem) => {
    setSelectedContentToEdit(item);
    setIsEditOpen(true);
  };

  const selectedScreen = screens.find((s) => s.id === selectedScreenId) || screens[0];

  const handleDelete = async (contentId: string) => {
    if (selectedScreen?.isLocked) {
      toast.error("La pantalla está bloqueada por el administrador.");
      return;
    }

    setDeletingId(contentId);
    try {
      const res = await deleteContentAction(contentId);
      if (res.success) {
        toast.success("Contenido eliminado de la secuencia");
      } else {
        toast.error(res.error || "No se pudo eliminar el contenido");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (contentId: string, currentActive: boolean) => {
    if (selectedScreen?.isLocked) {
      toast.error("La pantalla está bloqueada por el administrador.");
      return;
    }

    try {
      const res = await toggleContentActiveAction(contentId, !currentActive);
      if (res.success) {
        toast.success(!currentActive ? "Contenido activado en reproducción" : "Contenido pausado");
      } else {
        toast.error(res.error || "No se pudo actualizar el estado");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <VideoIcon className="size-4 text-emerald-400" />;
      case "text":
        return <FileTextIcon className="size-4 text-amber-400" />;
      case "web":
        return <GlobeIcon className="size-4 text-sky-400" />;
      default:
        return <ImageIcon className="size-4 text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video": return "Video MP4";
      case "text": return "Aviso / Texto";
      case "web": return "Página Web";
      default: return "Imagen / Banner";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Gestión de Contenidos y Programación</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <SparklesIcon className="size-3" />
              Publicador
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Asigna contenidos multimedia, define duraciones y efectos de transición para tus pantallas asignadas.
          </p>
        </div>
      </div>

      {screens.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-12 text-center text-muted-foreground backdrop-blur-md">
          <TvIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground">No tienes pantallas asignadas</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
            El administrador debe asignarte al menos una pantalla para que puedas programar y editar sus contenidos.
          </p>
        </div>
      ) : (
        <>
          {/* Screen Selection Pills / Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
              Seleccionar Pantalla:
            </span>
            {screens.map((sc) => {
              const isSelected = sc.id === selectedScreenId;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScreenId(sc.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  <TvIcon className="size-3.5" />
                  <span>{sc.name}</span>
                  {sc.isLocked && <LockIcon className="size-3 text-amber-300" />}
                </button>
              );
            })}
          </div>

          {/* Selected Screen Control Panel Header */}
          {selectedScreen && (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{selectedScreen.name}</h2>
                    {selectedScreen.isLocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                        <LockIcon className="size-3.5" /> Edición Bloqueada por Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2Icon className="size-3.5" /> Edición Habilitada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="size-3 text-primary" /> {selectedScreen.location}
                    </span>
                    <span>Orientación: <strong className="text-foreground uppercase">{selectedScreen.orientation}</strong></span>
                    <span>Resolución: <strong className="text-foreground font-mono">{selectedScreen.resolution}</strong></span>
                  </div>
                </div>

                <CreateContentDialog 
                  screenId={selectedScreen.id} 
                  screenName={selectedScreen.name}
                  isLocked={selectedScreen.isLocked} 
                />
              </div>

              {/* Locked Notice Banner if Screen is Locked */}
              {selectedScreen.isLocked && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-amber-300 text-xs font-semibold">
                  <AlertTriangleIcon className="size-5 shrink-0 text-amber-400" />
                  <span>
                    El administrador ha bloqueado la edición de contenidos para esta pantalla. Si requieres hacer cambios, solicita al administrador deshabilitar el bloqueo.
                  </span>
                </div>
              )}

              {/* Programmed Content Items Playlist Table */}
              <div className="overflow-hidden rounded-xl border border-border/50 bg-background/50">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground"># Secuencia</TableHead>
                      <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contenido & Tipo</TableHead>
                      <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Detalle / Enlace</TableHead>
                      <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Duración</TableHead>
                      <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Transición</TableHead>
                      <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado</TableHead>
                      <TableHead className="py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedScreen.contents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                          No hay contenidos programados en la secuencia de esta pantalla. Haz clic en "Añadir Contenido" para subir imágenes, videos o anuncios.
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedScreen.contents.map((item, index) => (
                        <TableRow key={item.id} className="transition-colors hover:bg-accent/40 border-b border-border/30 last:border-0">
                          <TableCell className="py-3 font-mono font-bold text-xs text-muted-foreground">
                            {index + 1}
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="size-8 rounded-lg bg-muted/60 border border-border/40 flex items-center justify-center">
                                {getTypeIcon(item.type)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-foreground">{item.title}</span>
                                <span className="text-[11px] text-muted-foreground font-semibold">{getTypeLabel(item.type)}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 max-w-xs truncate">
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline truncate block font-mono">
                                {item.url}
                              </a>
                            ) : item.body ? (
                              <span className="text-xs text-muted-foreground italic truncate block">
                                "{item.body}"
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>

                          <TableCell className="py-3">
                            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-bold font-mono">
                              <ClockIcon className="size-3 text-primary" />
                              {item.duration}s
                            </span>
                          </TableCell>

                          <TableCell className="py-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                            {item.transition}
                          </TableCell>

                          <TableCell className="py-3">
                            <button
                              disabled={selectedScreen.isLocked}
                              onClick={() => handleToggleActive(item.id, item.isActive)}
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                                item.isActive
                                  ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                                  : "border border-muted bg-muted/40 text-muted-foreground opacity-60"
                              }`}
                            >
                              <PowerIcon className="size-3" />
                              <span>{item.isActive ? "Activo" : "Pausado"}</span>
                            </button>
                          </TableCell>

                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={selectedScreen.isLocked}
                                onClick={() => handleEdit(item)}
                                className="h-8 w-8 p-0 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/15"
                                title="Editar parámetros del contenido"
                              >
                                <EditIcon className="size-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={selectedScreen.isLocked || deletingId === item.id}
                                onClick={() => handleDelete(item.id)}
                                className="h-8 w-8 p-0 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15"
                                title="Eliminar contenido de la secuencia"
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
            </div>
          )}
        </>
      )}

      {/* Edit Content Dialog */}
      <EditContentDialog 
        content={selectedContentToEdit} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        isLocked={selectedScreen?.isLocked} 
      />
    </div>
  );
}
