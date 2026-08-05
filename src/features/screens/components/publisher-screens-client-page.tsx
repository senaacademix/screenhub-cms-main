"use client";

import { useState } from "react";
import Link from "next/link";
import { Screen, User } from "@/generated/prisma";
import { 
  TvIcon, 
  ActivityIcon, 
  PowerOffIcon, 
  SearchIcon,
  MapPinIcon,
  MonitorIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  LockIcon,
  CheckCircle2Icon,
  SparklesIcon,
  FileTextIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

export type ScreenWithPublisher = Screen & {
  publisher?: User | null;
};

interface PublisherScreensClientPageProps {
  screens: ScreenWithPublisher[];
  userName?: string;
}

export function PublisherScreensClientPage({ screens, userName = "Publicador" }: PublisherScreensClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Filtered screens by search query
  const filteredScreens = screens.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Metrics
  const totalScreens = screens.length;
  const totalActive = screens.filter((s) => s.status === "active").length;
  const totalOffline = screens.filter((s) => s.status !== "active").length;

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
    toast.success("URL del reproductor copiada al portapapeles");
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-400 shadow-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </span>
          En Línea / Activa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-0.5 text-xs font-bold text-rose-400 shadow-xs">
        <span className="relative flex h-1.5 w-1.5">
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400"></span>
        </span>
        Deshabilitada por Admin
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Mis Pantallas Asignadas</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <SparklesIcon className="size-3" />
              Publicador
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Hola <span className="font-bold text-foreground">{userName}</span>. Aquí puedes consultar las pantallas asignadas a tu perfil por el administrador.
          </p>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mis Pantallas</span>
            <div className="size-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <TvIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{totalScreens}</span>
            <span className="text-xs text-muted-foreground font-medium">asignadas a tu cuenta</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transmitiendo</span>
            <div className="size-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ActivityIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-emerald-400">{totalActive}</span>
            <span className="text-xs text-muted-foreground font-medium">pantallas en vivo</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-rose-500/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-rose-500/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deshabilitadas</span>
            <div className="size-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <PowerOffIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-rose-400">{totalOffline}</span>
            <span className="text-xs text-muted-foreground font-medium">pendientes de activación admin</span>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Buscar mis pantallas por nombre, slug o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-border/60 bg-background/60 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      {/* Screens Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xl shadow-primary/5">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pantalla & URL</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ubicación</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Formato</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado Transmisión</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Permisos de Edición</TableHead>
              <TableHead className="py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScreens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center text-muted-foreground font-medium">
                  {screens.length === 0 
                    ? "No tienes pantallas asignadas por el administrador por el momento."
                    : "No se encontraron pantallas con la búsqueda ingresada."}
                </TableCell>
              </TableRow>
            ) : (
              filteredScreens.map((screen) => (
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
                            title="Copiar URL reproductor"
                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                          >
                            {copiedSlug === screen.slug ? <CheckIcon className="size-3.5 text-emerald-400" /> : <CopyIcon className="size-3.5" />}
                          </button>
                        </div>
                      </div>
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

                  <TableCell className="py-3.5">
                    {screen.isLocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                        <LockIcon className="size-3.5" />
                        Bloqueada por Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2Icon className="size-3.5" />
                        Edición Permitida
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href="/publisher/content">
                        <Button 
                          disabled={screen.isLocked}
                          size="sm" 
                          className="h-8 px-3 rounded-lg font-bold text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                        >
                          <FileTextIcon className="size-3.5" />
                          <span>Gestionar Contenido</span>
                        </Button>
                      </Link>

                      <a
                        href={`/screens/${screen.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver Reproductor de Pantalla"
                      >
                        <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border-primary/30 text-primary hover:bg-primary/15 font-semibold text-xs gap-1.5">
                          <span>Ver TV</span>
                          <ExternalLinkIcon className="size-3.5" />
                        </Button>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
