"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Loader2, 
  PlusIcon, 
  SparklesIcon, 
  FileTextIcon, 
  ImageIcon, 
  VideoIcon, 
  GlobeIcon, 
  ClockIcon,
  SlidersIcon,
  EyeIcon,
  PlayIcon,
  RotateCcwIcon,
  FolderIcon,
  XIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatVideoUrl, VideoPlatform } from "@/lib/utils";
import { createContentSchema, CreateContentSchema, TRANSITION_OPTIONS } from "../schemas/content.schema";
import { createContentAction } from "../actions/content.actions";
import { TransitionSelector } from "./transition-selector";
import { AnimeTextSplit } from "./anime-text-split";

interface CreateContentDialogProps {
  screenId: string;
  screenName: string;
  isLocked?: boolean;
}

// Framer Motion Preview Variants
const motionVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  "fade-scale": {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 1.15, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  "fade-up": {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  "fade-down": {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 40, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  slide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
  },
  "slide-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
  },
  "slide-up": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
    exit: { y: "-100%", opacity: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
  },
  "slide-down": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
  },
  "push-right": {
    initial: { x: "100%", opacity: 0, scale: 0.9 },
    animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { x: "-30%", opacity: 0.3, scale: 0.85, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  "push-left": {
    initial: { x: "-100%", opacity: 0, scale: 0.9 },
    animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { x: "30%", opacity: 0.3, scale: 0.85, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  zoom: {
    initial: { scale: 0.2, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { scale: 1.4, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  "zoom-out": {
    initial: { scale: 1.6, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { scale: 0.4, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  "pulse-zoom": {
    initial: { scale: 0.7, opacity: 0 },
    animate: { scale: [0.7, 1.05, 0.98, 1], opacity: 1, transition: { duration: 0.8, times: [0, 0.5, 0.8, 1] } },
    exit: { scale: 1.2, opacity: 0, transition: { duration: 0.5 } },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { rotateY: -90, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
  },
  "flip-y": {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { rotateX: -90, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
  },
  "flip-diagonal": {
    initial: { rotateX: 90, rotateY: 90, opacity: 0 },
    animate: { rotateX: 0, rotateY: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { rotateX: -90, rotateY: -90, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
  },
  rotate: {
    initial: { rotate: -180, scale: 0.2, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1, transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] } },
    exit: { rotate: 180, scale: 0.2, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
  },
  "rotate-corner": {
    initial: { rotate: 45, transformOrigin: "top left", opacity: 0 },
    animate: { rotate: 0, transformOrigin: "top left", opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { rotate: -45, transformOrigin: "top left", opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
  },
  skew: {
    initial: { skewX: 25, x: "50%", opacity: 0 },
    animate: { skewX: 0, x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { skewX: -25, x: "-50%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  blur: {
    initial: { filter: "blur(30px)", opacity: 0, scale: 1.1 },
    animate: { filter: "blur(0px)", opacity: 1, scale: 1, transition: { duration: 0.9, ease: "easeOut" } },
    exit: { filter: "blur(30px)", opacity: 0, scale: 0.9, transition: { duration: 0.5, ease: "easeIn" } },
  },
  "blur-zoom": {
    initial: { filter: "blur(40px)", opacity: 0, scale: 0.3 },
    animate: { filter: "blur(0px)", opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { filter: "blur(40px)", opacity: 0, scale: 1.4, transition: { duration: 0.5, ease: "easeIn" } },
  },
  bounce: {
    initial: { scale: 0.1, opacity: 0 },
    animate: { scale: [0.1, 1.12, 0.94, 1], opacity: 1, transition: { duration: 0.9, times: [0, 0.5, 0.75, 1] } },
    exit: { scale: 0.1, opacity: 0, transition: { duration: 0.4 } },
  },
  elastic: {
    initial: { scaleY: 0.2, scaleX: 1.5, opacity: 0 },
    animate: { scaleY: [0.2, 1.25, 0.9, 1], scaleX: [1.5, 0.85, 1.05, 1], opacity: 1, transition: { duration: 0.9, times: [0, 0.5, 0.8, 1] } },
    exit: { scaleY: 0.2, opacity: 0, transition: { duration: 0.4 } },
  },
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },
};

export function CreateContentDialog({ screenId, screenName, isLocked = false }: CreateContentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [testKey, setTestKey] = useState(0);

  const form = useForm<CreateContentSchema>({
    resolver: zodResolver(createContentSchema) as any,
    defaultValues: {
      title: "",
      type: "image",
      url: "",
      body: "",
      duration: 10,
      transition: "fade",
      transitionDuration: 1.0,
      screenId: screenId,
      isActive: true,
    },
  });

  const [videoPlatform, setVideoPlatform] = useState<VideoPlatform>("auto");

  const contentType = form.watch("type");
  const transitionEffect = form.watch("transition");
  const transitionDuration = form.watch("transitionDuration") || 1.0;
  const mediaUrl = form.watch("url");
  const textBody = form.watch("body");
  const titleText = form.watch("title");

  const triggerAnimationTest = () => {
    setTestKey((prev) => prev + 1);
  };

  const onSubmit = async (values: CreateContentSchema) => {
    if (isLocked) {
      toast.error("Esta pantalla está bloqueada por el administrador.");
      return;
    }

    setIsPending(true);
    try {
      const res = await createContentAction({ ...values, screenId });
      if (res.success) {
        toast.success("¡Contenido añadido a la secuencia!");
        form.reset({
          title: "",
          type: "image",
          url: "",
          body: "",
          duration: 10,
          transition: "fade",
          transitionDuration: 1.0,
          screenId: screenId,
          isActive: true,
        });
        setOpen(false);
      } else {
        toast.error(res.error || "No se pudo añadir el contenido");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsPending(false);
    }
  };

  const currentVariant = motionVariants[transitionEffect] || motionVariants.fade;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={isLocked}
          className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 px-5"
        >
          <PlusIcon className="mr-2 size-4" />
          Añadir Contenido
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-none w-screen h-screen max-h-screen fixed inset-0 translate-x-0 translate-y-0 rounded-none border-none p-0 flex flex-col bg-background/95 backdrop-blur-2xl overflow-hidden z-50">
        {/* Fullscreen Header (Symmetrical & Aligned) */}
        <div className="h-16 px-6 sm:px-8 border-b border-border/60 flex items-center justify-between bg-card/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
              <SparklesIcon className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight">Programar Nuevo Contenido</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Pantalla Receptora: <strong className="text-foreground font-bold">{screenName}</strong>
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="rounded-xl font-bold px-4 h-10 border-border/80" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              size="sm"
              onClick={form.handleSubmit(onSubmit)} 
              disabled={isPending}
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 px-6 h-10"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Contenido
            </Button>
            
            <div className="h-6 w-px bg-border/60 mx-1" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="size-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Cerrar ventana"
            >
              <XIcon className="size-5" />
            </Button>
          </div>
        </div>

        {/* Fullscreen 2-Column Split Studio Grid (Perfect Architectural Symmetry) */}
        <div className="flex-1 h-[calc(100vh-4rem)] p-4 sm:p-6 grid grid-cols-12 gap-6 bg-muted/10 overflow-hidden">
          
          {/* Left Column: Form Tabbed Studio (Symmetrical 7 Cols) */}
          <div className="col-span-12 lg:col-span-7 h-full flex flex-col bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-7 shadow-md backdrop-blur-xl overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                <Tabs defaultValue="general" className="w-full flex-1 flex flex-col overflow-hidden">
                  <TabsList className="w-full grid grid-cols-2 rounded-2xl p-1 bg-muted/60 border border-border/60 mb-5 shrink-0 h-11">
                    <TabsTrigger value="general" className="rounded-xl text-xs font-bold gap-2">
                      <FolderIcon className="size-4 text-primary" /> Recurso Multimedia & Tiempos
                    </TabsTrigger>
                    <TabsTrigger value="animation" className="rounded-xl text-xs font-bold gap-2">
                      <SlidersIcon className="size-4 text-amber-400" /> Animación Framer Motion (24)
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab 1: General Resource Settings */}
                  <TabsContent value="general" className="space-y-4 outline-none flex-1 overflow-y-auto pr-1">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Título / Identificador del Contenido
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ej. Banner Promocional de Verano" 
                              className="h-11 rounded-xl border-border/60 focus-visible:ring-primary/40 text-sm font-medium" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Tipo de Recurso
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-border/60 focus:ring-primary/40 font-semibold text-xs">
                                  <SelectValue placeholder="Selecciona tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border border-border/80">
                                <SelectItem value="image" className="rounded-lg font-medium text-xs py-2">
                                  <ImageIcon className="size-3.5 inline mr-2 text-primary" /> Imagen / Banner
                                </SelectItem>
                                <SelectItem value="video" className="rounded-lg font-medium text-xs py-2">
                                  <VideoIcon className="size-3.5 inline mr-2 text-emerald-400" /> Video MP4
                                </SelectItem>
                                <SelectItem value="text" className="rounded-lg font-medium text-xs py-2">
                                  <FileTextIcon className="size-3.5 inline mr-2 text-amber-400" /> Aviso / Texto Gigante
                                </SelectItem>
                                <SelectItem value="web" className="rounded-lg font-medium text-xs py-2">
                                  <GlobeIcon className="size-3.5 inline mr-2 text-sky-400" /> Sitio Web URL
                                </SelectItem>
                                <SelectItem value="split_anime" className="rounded-lg font-medium text-xs py-2">
                                  <SparklesIcon className="size-3.5 inline mr-2 text-indigo-400" /> Split 50/50: Imagen + Texto Anime.js
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {contentType === "video" ? (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Duración en Pantalla
                          </FormLabel>
                          <div className="h-11 px-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-2">
                            <SparklesIcon className="size-4 text-emerald-400 animate-pulse shrink-0" />
                            <span>Automática (Tiempo Total del Video)</span>
                          </div>
                        </FormItem>
                      ) : (
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Exposición en Pantalla (Segundos)
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <ClockIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                  <Input 
                                    type="number"
                                    min={3}
                                    max={600}
                                    placeholder="10" 
                                    className="pl-10 h-11 rounded-xl border-border/60 focus-visible:ring-primary/40 font-bold text-xs" 
                                    {...field} 
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {contentType !== "text" && (
                      <div className="space-y-3">
                        {contentType === "video" && (
                          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Plataforma / Fuente de Video
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
                              {[
                                { id: "auto", label: "🪄 Auto", icon: "✨" },
                                { id: "youtube", label: "YouTube", icon: "▶️" },
                                { id: "gdrive", label: "G-Drive", icon: "📁" },
                                { id: "vimeo", label: "Vimeo", icon: "🎬" },
                                { id: "dropbox", label: "Dropbox", icon: "📦" },
                                { id: "onedrive", label: "OneDrive", icon: "☁️" },
                                { id: "direct", label: "MP4/CDN", icon: "🌐" },
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setVideoPlatform(item.id as VideoPlatform)}
                                  className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                                    videoPlatform === item.id
                                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                      : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                >
                                  <span>{item.icon}</span>
                                  <span>{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <FormField
                          control={form.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                <span>
                                  {contentType === "web" 
                                    ? "URL Completa del Sitio Web" 
                                    : contentType === "video"
                                    ? `Enlace de Video (${videoPlatform.toUpperCase()})`
                                    : "Enlace Directo del Archivo (Imagen / Video)"}
                                </span>
                                {contentType === "video" && (
                                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                    Multi-Plataforma Activa
                                  </span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={
                                    contentType === "web" 
                                      ? "https://ejemplo.com/dashboard" 
                                      : contentType === "video"
                                      ? videoPlatform === "youtube"
                                        ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        : videoPlatform === "gdrive"
                                        ? "https://drive.google.com/file/d/1ABC.../view"
                                        : videoPlatform === "vimeo"
                                        ? "https://vimeo.com/76979871"
                                        : "https://ejemplo.com/video.mp4"
                                      : "https://images.unsplash.com/photo-1785079919137-cbf"
                                  } 
                                  className="h-11 rounded-xl border-border/60 focus-visible:ring-primary/40 font-mono text-xs" 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                              {contentType === "video" && (
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  💡 Soporta <strong>YouTube</strong>, <strong>Google Drive</strong>, <strong>Vimeo</strong>, <strong>Dropbox</strong>, <strong>OneDrive</strong> y enlaces directos <strong>MP4</strong>.
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {(contentType === "text" || contentType === "image" || contentType === "split_anime") && (
                      <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {contentType === "text" ? "Mensaje Principal del Anuncio" : "Subtítulo / Leyenda Opcional"}
                            </FormLabel>
                            <FormControl>
                              <textarea 
                                placeholder="Escribe el texto que se desplegará..." 
                                className="flex min-h-24 w-full rounded-xl border border-border/60 bg-transparent px-3.5 py-2.5 text-xs shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40 resize-none font-medium" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </TabsContent>

                  {/* Tab 2: Framer Motion Animation Settings */}
                  <TabsContent value="animation" className="outline-none flex-1 flex flex-col overflow-hidden">
                    <TransitionSelector 
                      value={transitionEffect}
                      onChange={(val) => {
                        form.setValue("transition", val);
                        triggerAnimationTest();
                      }}
                      speed={transitionDuration}
                      onSpeedChange={(spd) => {
                        form.setValue("transitionDuration", spd);
                        triggerAnimationTest();
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </div>

          {/* Right Column: Symmetrical TV Visor Studio (5 Cols) */}
          <div className="col-span-12 lg:col-span-5 h-full flex flex-col justify-between bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-7 shadow-md backdrop-blur-xl overflow-hidden">
            {/* Studio Visor Header */}
            <div className="flex items-center justify-between shrink-0 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  Previsualización en Vivo
                </span>
              </div>

              <span className="text-[10px] font-mono font-black text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full shadow-inner">
                100% Fullscreen TV
              </span>
            </div>

            {/* 16:9 Realistic TV Screen Visor Box */}
            <div className="flex-1 my-4 relative rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={transitionEffect + "-" + testKey}
                  initial={currentVariant.initial as any}
                  animate={{
                    ...currentVariant.animate,
                    transition: {
                      ...(currentVariant.animate as any)?.transition,
                      duration: transitionDuration,
                    },
                  } as any}
                  exit={currentVariant.exit as any}
                  className="w-full h-full flex items-center justify-center bg-black overflow-hidden"
                >
                  {contentType === "image" && (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      {mediaUrl ? (
                        <img src={mediaUrl} alt={titleText || "Preview"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-6 text-white/40">
                          <ImageIcon className="size-14 mx-auto mb-2 opacity-50 text-primary" />
                          <p className="text-xs font-medium text-white/60">Ingresa la URL de la imagen para visualizarla</p>
                        </div>
                      )}
                      {textBody && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 text-center">
                          <p className="text-sm font-extrabold text-white">{textBody}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {contentType === "video" && (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      {mediaUrl ? (
                        (() => {
                          const media = formatVideoUrl(mediaUrl, videoPlatform);
                          if (media.isIframe) {
                            return (
                              <iframe
                                src={media.url}
                                title="Video Platform Preview"
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                className="w-full h-full border-0 pointer-events-none"
                              />
                            );
                          }
                          return (
                            <video src={media.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          );
                        })()
                      ) : (
                        <div className="text-center p-6 text-white/40">
                          <VideoIcon className="size-14 mx-auto mb-2 opacity-50 text-emerald-400" />
                          <p className="text-xs font-medium text-white/60">Ingresa la URL de YouTube, G-Drive, Vimeo, Dropbox, OneDrive o MP4</p>
                        </div>
                      )}
                    </div>
                  )}

                  {contentType === "text" && (
                    <div className="w-full h-full bg-gradient-to-br from-[#0a0f24] via-[#050811] to-[#120e29] text-white flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <FileTextIcon className="size-12 text-amber-400" />
                      <h4 className="text-2xl font-black tracking-tight">{titleText || "Título del Anuncio"}</h4>
                      {textBody && <p className="text-xs text-amber-200/90 font-medium">"{textBody}"</p>}
                    </div>
                  )}

                  {contentType === "web" && (
                    <div className="w-full h-full bg-white">
                      {mediaUrl ? (
                        <iframe src={mediaUrl} title="Web Preview" className="w-full h-full border-0 pointer-events-none" />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-center p-6 text-white/40">
                          <GlobeIcon className="size-14 mx-auto mb-2 opacity-50 text-sky-400" />
                          <p className="text-xs font-medium text-white/60">Ingresa una URL web pública</p>
                        </div>
                      )}
                    </div>
                  )}

                  {contentType === "split_anime" && (
                    <AnimeTextSplit 
                      imageUrl={mediaUrl || ""}
                      title={titleText || "Título del Anuncio"}
                      body={textBody || ""}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Studio Visor Footer Controls */}
            <div className="shrink-0 space-y-3 pt-3 border-t border-border/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-semibold">Efecto Activo:</span>
                <span className="font-bold text-primary capitalize bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-xs">
                  {transitionEffect} ({transitionDuration}s)
                </span>
              </div>

              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={triggerAnimationTest}
                className="w-full rounded-2xl font-extrabold gap-2 text-xs py-2.5 border border-border/60 hover:bg-muted/80 h-10 shadow-sm"
              >
                <PlayIcon className="size-3.5 fill-primary text-primary" /> Probar Animación Framer Motion
              </Button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
