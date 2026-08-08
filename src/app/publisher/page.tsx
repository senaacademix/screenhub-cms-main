import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { 
  FolderIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  CheckCircle2Icon,
  ClockIcon,
  FileEditIcon,
  SendIcon,
  ImageIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PublisherPage() {
  const session = await getSession();
  if (!session) return null;

  const publications = await prisma.publication.findMany({
    where: { createdById: session.user.id },
    include: { contents: true },
    orderBy: { createdAt: "desc" },
  });

  const draftCount = publications.filter((p) => p.status === "DRAFT").length;
  const reviewCount = publications.filter((p) => p.status === "REVIEW").length;
  const publishedCount = publications.filter((p) => p.status === "PUBLISHED").length;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-md shadow-xl shadow-primary/5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/15 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="size-3.5" />
              <span>Espacio de Trabajo del Publicador</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              ¡Hola, <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">{session.user.name}</span>!
            </h1>
            
            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
              Crea publicaciones compuestas con múltiples contenidos multimedia. El Administrador revisará tus solicitudes y las programará en las pantallas de la red.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/publisher/content">
              <Button size="lg" className="rounded-xl px-5 font-bold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 group">
                <FolderIcon className="size-4 mr-2" />
                Mis Publicaciones
                <ArrowRightIcon className="size-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Publicaciones</span>
            <div className="size-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <FolderIcon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-foreground">{publications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Campañas creadas</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">En Edición</span>
            <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileEditIcon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-amber-400">{draftCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Borradores en preparación</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">En Auditoría</span>
            <div className="size-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <SendIcon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-sky-400">{reviewCount}</div>
            <p className="text-xs text-muted-foreground mt-1">En revisión por admin</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publicadas</span>
            <div className="size-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2Icon className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight text-emerald-400">{publishedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Aprobadas / En emisión</p>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <FolderIcon className="size-5 text-primary" />
            Publicaciones Recientes
          </h3>
          {publications.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No has creado publicaciones aún.</p>
          ) : (
            <div className="space-y-2">
              {publications.slice(0, 4).map((pub) => (
                <div key={pub.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-background/50">
                  <div>
                    <p className="font-bold text-sm text-foreground">{pub.title}</p>
                    <p className="text-xs text-muted-foreground">{pub.contents.length} contenidos multimedia</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    pub.status === "PUBLISHED" 
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : pub.status === "REVIEW"
                      ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}>
                    {pub.status === "PUBLISHED" ? "Publicada" : pub.status === "REVIEW" ? "En Auditoría" : "En Edición"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <SparklesIcon className="size-5 text-primary" />
              Acciones Rápidas
            </h3>
            <p className="text-xs text-muted-foreground">Accede directamente a tus módulos principales de publicación.</p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link href="/publisher/content" className="block">
              <Button variant="outline" className="w-full justify-start rounded-xl font-semibold border-border/60 hover:bg-accent hover:border-primary/40">
                <FolderIcon className="size-4 mr-2 text-primary" />
                Gestión de Publicaciones & Campañas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
