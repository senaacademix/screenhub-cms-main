"use client";

import { User } from "@/generated/prisma";
import { MoreHorizontal, Shield, UserX, CalendarIcon, MailIcon } from "lucide-react";

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

interface UsersTableProps {
  users: User[];
  onEditRole: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, onEditRole, onDelete }: UsersTableProps) {
  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-400 shadow-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            </span>
            Administrador
          </span>
        );
      case "publisher":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-0.5 text-xs font-bold text-blue-400 shadow-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            </span>
            Publicador
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-0.5 text-xs font-medium text-muted-foreground">
            Sin Rol
          </span>
        );
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xl shadow-primary/5">
      <Table>
        <TableHeader className="bg-muted/40 border-b border-border/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usuario</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Correo Electrónico</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rol de Acceso</TableHead>
            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Fecha Registro</TableHead>
            <TableHead className="py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                No se encontraron usuarios en la búsqueda.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="transition-colors hover:bg-accent/40 border-b border-border/30 last:border-0">
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-primary font-bold text-xs shadow-xs">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-2 text-sm text-foreground/90">
                    <MailIcon className="size-3.5 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5">{getRoleBadge(user.role)}</TableCell>
                <TableCell className="py-3.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                    <span>{new Date(user.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/15 hover:text-primary transition-all">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg">
                      <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Acciones de Usuario</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onEditRole(user)}
                        className="rounded-lg font-medium cursor-pointer focus:bg-primary/15 focus:text-primary"
                      >
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                        Cambiar Rol
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-lg font-medium cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                        onClick={() => onDelete(user)}
                        disabled={user.role === "admin"}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Eliminar Cuenta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
