import { getSession } from "@/proxy";
import { ImageIcon, VideoIcon, FileTextIcon, GlobeIcon, SparklesIcon } from "lucide-react";

export default async function PublisherMediaPage() {
  const session = await getSession();
  if (!session) return null;

  const mediaCategories = [
    { name: "Banners e Imágenes", icon: ImageIcon, count: "Archivos JPG, PNG, WebP", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { name: "Video Clips", icon: VideoIcon, count: "Archivos MP4, WebM", color: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
    { name: "Avisos de Texto", icon: FileTextIcon, count: "Marquesinas y Carteles", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { name: "Sitios y Widgets Web", icon: GlobeIcon, count: "URLs y Dashboards", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Biblioteca Multimedia</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <SparklesIcon className="size-3" />
              Recursos
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Explora y gestiona los formatos multimedia listos para ser transmitidos en tus pantallas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mediaCategories.map((cat, i) => (
          <div key={i} className="relative group overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg space-y-4">
            <div className={`size-12 rounded-xl border flex items-center justify-center ${cat.color}`}>
              <cat.icon className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
