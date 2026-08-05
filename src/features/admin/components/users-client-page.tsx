"use client";

import { useState } from "react";
import { User } from "@/generated/prisma";
import { UsersTable } from "./users-table";
import { CreateUserDialog } from "./create-user-dialog";
import { EditRoleDialog } from "./edit-role-dialog";
import { DeleteUserAlert } from "./delete-user-alert";
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  TvIcon, 
  SearchIcon,
  FilterIcon,
  SparklesIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersClientPageProps {
  initialUsers: User[];
}

export function UsersClientPage({ initialUsers }: UsersClientPageProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Dialog states
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsEditRoleOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Metrics
  const totalUsers = initialUsers.length;
  const totalAdmins = initialUsers.filter((u) => u.role === "admin").length;
  const totalPublishers = initialUsers.filter((u) => u.role === "publisher").length;

  // Filtered users
  const filteredUsers = initialUsers.filter((u) => {
    const matchesSearch = 
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gestión de Usuarios</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {totalUsers} cuentas
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Administra usuarios, roles y permisos de acceso para la red de cartelería digital.
          </p>
        </div>
        
        <CreateUserDialog />
      </div>

      {/* AI Canvas Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Usuarios</span>
            <div className="size-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <UsersIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{totalUsers}</span>
            <span className="text-xs text-muted-foreground font-medium">registrados</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-amber-500/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Administradores</span>
            <div className="size-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <ShieldCheckIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-amber-400">{totalAdmins}</span>
            <span className="text-xs text-muted-foreground font-medium">acceso completo</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-blue-500/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicadores</span>
            <div className="size-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TvIcon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-blue-400">{totalPublishers}</span>
            <span className="text-xs text-muted-foreground font-medium">gestión de pantallas</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-border/60 bg-background/60 focus-visible:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <FilterIcon className="size-3.5" />
            <span>Filtrar:</span>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-10 w-full sm:w-44 rounded-xl border-border/60 bg-background/60 focus:ring-primary/40 font-medium text-xs">
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="publisher">Publicador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable 
        users={filteredUsers} 
        onEditRole={handleEditRole} 
        onDelete={handleDelete} 
      />

      {/* Dialogs */}
      <EditRoleDialog 
        user={selectedUser} 
        open={isEditRoleOpen} 
        onOpenChange={setIsEditRoleOpen} 
      />
      
      <DeleteUserAlert 
        user={selectedUser} 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
      />
    </div>
  );
}
