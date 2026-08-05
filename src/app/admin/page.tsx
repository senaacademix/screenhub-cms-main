import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  TvIcon, 
  ActivityIcon,
  SparklesIcon,
  ArrowRightIcon,
  ServerIcon,
  CpuIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) return null;

  const totalUsers = await prisma.user.count();
  const totalAdmins = await prisma.user.count({ where: { role: "admin" } });
  const totalPublishers = await prisma.user.count({ where: { role: "publisher" } });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-md shadow-xl shadow-primary/5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/15 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="size-3.5" />
              <span>Panel de Control Principal</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Bienvenido de nuevo, <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">{session.user.name}</span>
            </h1>
            
            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
              Monitorea el estado del sistema, gestiona cuentas de usuarios y supervisa los permisos de la red de pantallas digitales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/users">
              <Button size="lg" className="rounded-xl px-5 font-bold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 group">
                <UsersIcon className="size-4 mr-2" />
                Gestionar Usuarios
                <ArrowRightIcon className="size-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Usuarios Totales</span>
            <div className="size-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <UsersIcon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Cuentas registradas</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Administradores</span>
            <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheckIcon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-amber-400">{totalAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">Control del sistema</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicadores</span>
            <div className="size-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TvIcon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-blue-400">{totalPublishers}</div>
            <p className="text-xs text-muted-foreground mt-1">Gestores de pantallas</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado Servidor</span>
            <div className="size-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ActivityIcon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-emerald-400">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">Tiempo de actividad</p>
          </div>
        </div>
      </div>

      {/* System Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <ServerIcon className="size-5 text-primary" />
              Detalles de la Cuenta Actual
            </h3>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-400">
              {session.user.role}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-border/40 bg-background/50 space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Nombre del Administrador</span>
              <p className="font-bold text-foreground">{session.user.name}</p>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-background/50 space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Correo de Contacto</span>
              <p className="font-bold text-foreground">{session.user.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <CpuIcon className="size-5 text-primary" />
              Accesos Rápidos
            </h3>
            <p className="text-xs text-muted-foreground">Atajos directos para la administración del portal.</p>
          </div>

          <div className="space-y-2 pt-2">
            <Link href="/admin/users" className="block">
              <Button variant="outline" className="w-full justify-start rounded-xl font-semibold border-border/60 hover:bg-accent hover:border-primary/40">
                <UsersIcon className="size-4 mr-2 text-primary" />
                Gestión de Usuarios
              </Button>
            </Link>
            <Link href="/monitoring" className="block">
              <Button variant="outline" className="w-full justify-start rounded-xl font-semibold border-border/60 hover:bg-accent hover:border-primary/40">
                <ActivityIcon className="size-4 mr-2 text-primary" />
                Monitoreo Global
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
