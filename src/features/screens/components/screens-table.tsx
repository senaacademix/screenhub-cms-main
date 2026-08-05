"use client";

import { Screen, User } from "@/generated/prisma";
import { 
  MoreHorizontal, 
  EditIcon, 
  Trash2Icon, 
  CopyIcon, 
  ExternalLinkIcon, 
  MapPinIcon, 
  MonitorIcon, 
  CheckIcon,
  UserIcon
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export type ScreenWithPublisher = Screen & {
  publisher?: User | null;
};

interface ScreensTableProps {
  screens: ScreenWithPublisher[];
  onEdit: (screen: ScreenWithPublisher) => void;
  onDelete: (screen: ScreenWithPublisher) => void;
}

import { toggleScreenStatusAction, toggleScreenLockAction } from "../actions/screen.actions";
import { PowerIcon, LockIcon, UnlockIcon, EyeIcon, PlayIcon } from "lucide-react";

export function ScreensTable({ screens, onEdit, onDelete }: ScreensTableProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (screen: ScreenWithPublisher) => {
    const nextStatus = screen.status === "active" ? "offline" : "active";
    setTogglingId(screen.id);
    try {
      const res = await toggleScreenStatusAction(screen.id, nextStatus);
      if (res.success) {
        toast.success(nextStatus === "active" ? "Pantalla habilitada para transmisión" : "Pantalla deshabilitada");
      } else {
        toast.error(res.error || "No se pudo cambiar el estado");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleLock = async (screen: ScreenWithPublisher) => {
    const nextLock = !screen.isLocked;
    setTogglingId(screen.id);
    try {
      const res = await toggleScreenLockAction(screen.id, nextLock);
      if (res.success) {
        toast.success(nextLock ? "Edición del publicador BLOQUEADA" : "Edición del publicador DESBLOQUEADA");
      } else {
        toast.error(res.error || "No se pudo cambiar el bloqueo");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setTogglingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-400 shadow-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </span>
            En Línea / Activa
          </span>
        );
      case "offline":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-0.5 text-xs font-bold text-rose-400 shadow-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400"></span>
            </span>
            Fuera de Línea
          </span>
        );
      case "maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-400 shadow-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            </span>
            Mantenimiento
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-0.5 text-xs font-medium text-muted-foreground">
            Desconocido
          </span>
        );
    }
  };

  const getClientUrl = (slug: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/screens/${slug}`;
    }
    return `/screens/${slug}`;
  };

  const handleCopyUrl = (slug: string) => {
    const url = getClientUrl(slug);
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast.success("URL del cliente copiada al portapapeles");
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xl shadow-primary/5">
      <Table>
        <TableHeader className="bg-muted/40 border-b border-border/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pantalla & URL</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicador Asignado</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ubicación</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Formato</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado</TableHead>
            <TableHead className="py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {screens.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium">
                No se encontraron pantallas registradas.
              </TableCell>
            </TableRow>
          ) : (
            screens.map((screen) => (
              <TableRow key={screen.id} className="transition-colors hover:bg-accent/40 border-b border-border/30 last:border-0">
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary font-bold text-xs shadow-xs">
                      <MonitorIcon className="size-5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm tracking-tight text-foreground">{screen.name}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] bg-muted/60 px-2 py-0.5 rounded-md font-mono text-muted-foreground border border-border/40">
                          /screens/{screen.slug}
                        </code>
                        <button 
                          onClick={() => handleCopyUrl(screen.slug)}
                          title="Copiar URL cliente"
                          className="text-muted-foreground hover:text-primary transition-colors p-1"
                        >
                          {copiedSlug === screen.slug ? <CheckIcon className="size-3.5 text-emerald-400" /> : <CopyIcon className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <div className="flex flex-col gap-1 items-start">
                    {screen.publisher ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <UserIcon className="size-3" />
                        {screen.publisher.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic bg-muted/40 px-2.5 py-1 rounded-full border border-border/40">
                        Sin Asignar
                      </span>
                    )}

                    {screen.isLocked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                        <LockIcon className="size-3" /> Edición Bloqueada
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <div className="flex items-center gap-2 text-sm text-foreground/90 font-medium">
                    <MapPinIcon className="size-3.5 text-primary/70 shrink-0" />
                    <span>{screen.location}</span>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-semibold text-foreground uppercase tracking-wider">{screen.orientation}</span>
                    <span className="text-muted-foreground font-mono text-[11px]">{screen.resolution}</span>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">{getStatusBadge(screen.status)}</TableCell>

                <TableCell className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Probar Contenido (Preview Mode for Admin) */}
                    <a
                      href={`/screens/${screen.slug}?preview=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Probar Contenido antes de publicar"
                    >
                      <Button variant="secondary" size="sm" className="h-8 px-2.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/15 font-bold text-xs gap-1.5 shadow-xs">
                        <EyeIcon className="size-3.5 text-amber-400" />
                        <span>Probar Contenido</span>
                      </Button>
                    </a>

                    <Button
                      variant={screen.status === "active" ? "outline" : "default"}
                      size="sm"
                      disabled={togglingId === screen.id}
                      onClick={() => handleToggleStatus(screen)}
                      className={`h-8 px-2.5 rounded-lg font-bold text-xs gap-1.5 transition-all ${
                        screen.status === "active"
                          ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/15"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                      }`}
                    >
                      <PowerIcon className="size-3.5" />
                      <span>{screen.status === "active" ? "Deshabilitar" : "Habilitar"}</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/15 hover:text-primary transition-all">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg">
                        <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Acciones de Control</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(screen)}
                          className="rounded-lg font-medium cursor-pointer"
                        >
                          <PowerIcon className="mr-2 h-4 w-4 text-emerald-400" />
                          {screen.status === "active" ? "Deshabilitar Transmisión" : "Habilitar Transmisión"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleLock(screen)}
                          className="rounded-lg font-medium cursor-pointer"
                        >
                          {screen.isLocked ? (
                            <>
                              <UnlockIcon className="mr-2 h-4 w-4 text-emerald-400" />
                              Desbloquear Edición Publicador
                            </>
                          ) : (
                            <>
                              <LockIcon className="mr-2 h-4 w-4 text-amber-400" />
                              Bloquear Edición Publicador
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleCopyUrl(screen.slug)}
                          className="rounded-lg font-medium cursor-pointer"
                        >
                          <CopyIcon className="mr-2 h-4 w-4 text-primary" />
                          Copiar URL Cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEdit(screen)}
                          className="rounded-lg font-medium cursor-pointer"
                        >
                          <EditIcon className="mr-2 h-4 w-4 text-amber-400" />
                          Editar Configuración
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-lg font-medium cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                          onClick={() => onDelete(screen)}
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          Eliminar Pantalla
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
