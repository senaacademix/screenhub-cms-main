"use client";

import { useState } from "react";
import { User } from "@/generated/prisma";
import { ScreensTable, ScreenWithPublisher } from "./screens-table";
import { CreateScreenDialog } from "./create-screen-dialog";
import { EditScreenDialog } from "./edit-screen-dialog";
import { DeleteScreenAlert } from "./delete-screen-alert";
import { 
  TvIcon, 
  ActivityIcon, 
  PowerOffIcon, 
  SearchIcon,
  FilterIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScreensClientPageProps {
  initialScreens: ScreenWithPublisher[];
  publishers?: User[];
}

export function ScreensClientPage({ initialScreens, publishers = [] }: ScreensClientPageProps) {
  const [selectedScreen, setSelectedScreen] = useState<ScreenWithPublisher | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (screen: ScreenWithPublisher) => {
    setSelectedScreen(screen);
    setIsEditOpen(true);
  };

  const handleDelete = (screen: ScreenWithPublisher) => {
    setSelectedScreen(screen);
    setIsDeleteOpen(true);
  };

  // Metrics
  const totalScreens = initialScreens.length;
  const totalActive = initialScreens.filter((s) => s.status === "active").length;
  const totalOffline = initialScreens.filter((s) => s.status === "offline" || s.status === "maintenance").length;

  // Filtered screens
  const filteredScreens = initialScreens.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gestión de Pantallas</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {totalScreens} dispositivos
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Administra las pantallas clientes receptores de la red de cartelería digital.
          </p>
        </div>

        <CreateScreenDialog publishers={publishers} />
      </div>

      {/* AI Canvas Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pantallas</span>
            <div className="size-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <TvIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{totalScreens}</span>
            <span className="text-xs text-muted-foreground font-medium">dispositivos registrados</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">En Línea</span>
            <div className="size-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ActivityIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-emerald-400">{totalActive}</span>
            <span className="text-xs text-muted-foreground font-medium">transmitiendo en vivo</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-rose-500/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-rose-500/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inactivas / Mantenimiento</span>
            <div className="size-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <PowerOffIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-rose-400">{totalOffline}</span>
            <span className="text-xs text-muted-foreground font-medium">requieren atención</span>
          </div>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Buscar por nombre, slug o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-border/60 bg-background/60 focus-visible:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <FilterIcon className="size-3.5" />
            <span>Estado:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full sm:w-48 rounded-xl border-border/60 bg-background/60 focus:ring-primary/40 font-medium text-xs">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">En Línea / Activas</SelectItem>
              <SelectItem value="offline">Fuera de Línea</SelectItem>
              <SelectItem value="maintenance">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Screens Table */}
      <ScreensTable 
        screens={filteredScreens} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {/* Dialogs */}
      <EditScreenDialog 
        screen={selectedScreen} 
        publishers={publishers}
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />
      
      <DeleteScreenAlert 
        screen={selectedScreen} 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
      />
    </div>
  );
}
