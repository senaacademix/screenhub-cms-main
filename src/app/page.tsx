import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightIcon, 
  MonitorIcon, 
  ShieldCheckIcon, 
  ZapIcon,
  SparklesIcon,
  LayersIcon,
  CpuIcon
} from "lucide-react";
import { hasUsers } from "@/features/auth";

export default async function Home() {
  const usersExist = await hasUsers();
  return (
    <div className="relative flex flex-col min-h-screen bg-background bg-aic-grid overflow-hidden">
      {/* Background ambient glow spots */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/15 blur-[120px] animate-aic-glow" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary shadow-sm">
              <Image 
                src="/logo.png" 
                alt="ScreenHub Logo" 
                width={22} 
                height={22} 
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight">ScreenHub</span>
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                v2.0
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground font-medium">
                Iniciar Sesión
              </Button>
            </Link>
            {!usersExist && (
              <Link href="/sign-up">
                <Button size="sm" className="rounded-lg px-5 font-semibold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Comenzar Gratis
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="container relative z-10 px-4 md:px-8 text-center max-w-4xl mx-auto space-y-8">
            {/* AI Canvas style Pill Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-card/80 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-semibold text-foreground shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <SparklesIcon className="size-3.5 text-primary" />
              <span>Plataforma de Cartelería Digital Inteligente</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Gestiona tus pantallas <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                con potencia sin límites.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
              La plataforma centralizada para administrar, publicar y auditar contenidos multimedia en tiempo real en redes de pantallas digitales.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sign-in">
                <Button size="lg" className="h-13 px-8 rounded-xl text-base font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-[1.03] active:scale-[0.97] group">
                  Ir al Dashboard
                  <ArrowRightIcon className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {!usersExist && (
                <Link href="/sign-up">
                  <Button variant="outline" size="lg" className="h-13 px-8 rounded-xl text-base font-bold border-border/80 bg-card/60 backdrop-blur-sm hover:bg-card hover:border-primary/40 transition-all">
                    Ver Demostración
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* AI Canvas Feature Cards */}
        <section className="py-20 border-t border-border/40 bg-card/30 backdrop-blur-xs">
          <div className="container px-4 md:px-8 max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Diseñado para la máxima eficiencia</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Múltiples roles, control absoluto y velocidad de nivel empresarial.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-7 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="size-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                  <MonitorIcon className="size-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Gestión en Tiempo Real</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Monitorea y actualiza el estado de cada pantalla al instante con telemetría en vivo.</p>
              </div>

              <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-7 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="size-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                  <ShieldCheckIcon className="size-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Seguridad y Roles</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Layouts y permisos aislados para Administradores, Publicadores y Auditores.</p>
              </div>

              <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-7 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="size-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                  <ZapIcon className="size-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Despliegue Ultra Rápido</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Optimizado con Next.js App Router y Turbopack para cargas y cambios instantáneos.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 bg-card/80 backdrop-blur-md">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="ScreenHub" width={20} height={20} />
            <span className="font-bold tracking-tight text-sm">ScreenHub — AI Canvas Theme</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ScreenHub. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
