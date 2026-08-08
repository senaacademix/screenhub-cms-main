import { getSession } from "@/proxy";
import { CalendarIcon, ClockIcon, SparklesIcon } from "lucide-react";

export default async function SchedulePage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Programación de Emisión</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <SparklesIcon className="size-3" />
              Calendario
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Organiza horarios de reproducción automática y eventos especiales para tus pantallas.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 flex flex-col items-center justify-center text-center space-y-4 backdrop-blur-md">
        <div className="size-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
          <CalendarIcon className="size-8 text-primary" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-lg font-bold text-foreground">Programación Automatizada</h3>
          <p className="text-sm text-muted-foreground">
            Los horarios dinámicos por franjas horarias estarán disponibles en la próxima versión. Actualmente los contenidos se emiten en secuencia continua de playlist.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1 text-xs font-semibold text-muted-foreground font-mono">
          <ClockIcon className="size-3.5 text-primary" /> Modo continuo activo (24/7)
        </div>
      </div>
    </div>
  );
}
