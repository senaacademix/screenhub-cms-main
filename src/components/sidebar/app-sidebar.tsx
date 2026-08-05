"use client"

import { authClient } from "@/lib/auth-client"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  UsersIcon, 
  SettingsIcon, 
  MonitorIcon, 
  TvIcon, 
  FileTextIcon, 
  CalendarIcon, 
  ImageIcon, 
  LayoutDashboardIcon,
  SparklesIcon
} from "lucide-react"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession()
  const pathname = usePathname()

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
  }

  const role = session?.user?.role || "user"
  const roleLabels = {
    admin: "Administrador",
    publisher: "Publicador",
  }
  const roleLabel = roleLabels[role as keyof typeof roleLabels] || role

  const navItems = {
    admin: [
      { title: "Dashboard", icon: LayoutDashboardIcon, url: "/admin" },
      { title: "Gestión de Pantallas", icon: TvIcon, url: "/admin/screens" },
      { title: "Gestión de Usuarios", icon: UsersIcon, url: "/admin/users" },
      { title: "Monitoreo Global", icon: MonitorIcon, url: "/monitoring" },
      { title: "Configuración", icon: SettingsIcon, url: "/admin/settings" },
    ],
    publisher: [
      { title: "Dashboard", icon: LayoutDashboardIcon, url: "/publisher" },
      { title: "Mis Pantallas", icon: TvIcon, url: "/publisher/screens" },
      { title: "Contenidos", icon: FileTextIcon, url: "/publisher/content" },
      { title: "Programación", icon: CalendarIcon, url: "/publisher/schedule" },
      { title: "Biblioteca Multimedia", icon: ImageIcon, url: "/publisher/media" },
    ]
  }

  const currentNav = navItems[role as keyof typeof navItems] || []

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border/40 bg-card/60 backdrop-blur-md" {...props}>
      <SidebarHeader className="p-4 border-b border-border/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent"
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary shadow-sm">
                  <Image 
                    src="/logo.png" 
                    alt="ScreenHub Logo" 
                    width={22} 
                    height={22} 
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-lg font-black tracking-tight text-foreground">ScreenHub</span>
                  <span className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-1">
                    <SparklesIcon className="size-2.5 text-primary" />
                    {roleLabel}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="gap-1.5">
          {currentNav.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title} 
                  className={`rounded-xl h-11 px-3.5 transition-all duration-200 ${
                    isActive 
                      ? "bg-primary/15 border border-primary/30 text-primary font-bold shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60 hover:border hover:border-border/50"
                  }`}
                >
                  <Link href={item.url} className="flex items-center gap-3 w-full">
                    <item.icon className={`size-4.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm tracking-tight">
                      {item.title}
                    </span>
                    {isActive && (
                      <span className="ml-auto size-1.5 rounded-full bg-primary shadow-sm shadow-primary" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/30">
        <NavUser user={{ ...user, role: roleLabel }} />
      </SidebarFooter>
    </Sidebar>
  )
}
