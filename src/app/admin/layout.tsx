import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/theme/mode-toggle"
import { SparklesIcon, ShieldCheckIcon } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh flex flex-col overflow-hidden bg-background bg-aic-grid relative">
        {/* Background glow effects */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/80 backdrop-blur-md px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 rounded-lg border border-border/50 hover:bg-accent hover:border-primary/30 transition-all" />
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>ScreenHub</span>
              <span>/</span>
              <span className="text-foreground flex items-center gap-1.5">
                <ShieldCheckIcon className="size-3.5 text-primary" />
                Panel de Administración
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <SparklesIcon className="size-3 text-primary" />
              <span>Sistema Activo</span>
            </div>
            <ModeToggle />
          </div>
        </header>

        {/* Main scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
