"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ContentItem, Screen } from "@/generated/prisma";
import { formatVideoUrl } from "@/lib/utils";
import { AnimeTextSplit } from "@/features/content/components/anime-text-split";
import { 
  MonitorIcon, 
  MapPinIcon, 
  LockIcon, 
  EyeIcon, 
  FileTextIcon, 
  GlobeIcon, 
  ImageIcon, 
  VideoIcon,
  Volume2Icon
} from "lucide-react";

export type ScreenWithContent = Screen & {
  contents?: ContentItem[];
};

interface ClientScreenPlayerProps {
  screen: ScreenWithContent;
  isPreviewMode?: boolean;
}

// Framer Motion Transition Variants Map (24 Complete Effects)
const motionVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.9, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  "fade-scale": {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 1.15, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  "fade-up": {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  "fade-down": {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 40, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  slide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
  },
  "slide-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
  },
  "slide-up": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] } },
    exit: { y: "-100%", opacity: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
  },
  "slide-down": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
  },
  "push-right": {
    initial: { x: "100%", opacity: 0, scale: 0.9 },
    animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { x: "-30%", opacity: 0.3, scale: 0.85, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  "push-left": {
    initial: { x: "-100%", opacity: 0, scale: 0.9 },
    animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { x: "30%", opacity: 0.3, scale: 0.85, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  zoom: {
    initial: { scale: 0.2, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { scale: 1.4, opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  "zoom-out": {
    initial: { scale: 1.6, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { scale: 0.4, opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  "pulse-zoom": {
    initial: { scale: 0.7, opacity: 0 },
    animate: { scale: [0.7, 1.05, 0.98, 1], opacity: 1, transition: { duration: 0.9, times: [0, 0.5, 0.8, 1] } },
    exit: { scale: 1.2, opacity: 0, transition: { duration: 0.6 } },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
    exit: { rotateY: -90, opacity: 0, transition: { duration: 0.7, ease: "easeIn" } },
  },
  "flip-y": {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
    exit: { rotateX: -90, opacity: 0, transition: { duration: 0.7, ease: "easeIn" } },
  },
  "flip-diagonal": {
    initial: { rotateX: 90, rotateY: 90, opacity: 0 },
    animate: { rotateX: 0, rotateY: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
    exit: { rotateX: -90, rotateY: -90, opacity: 0, transition: { duration: 0.7, ease: "easeIn" } },
  },
  rotate: {
    initial: { rotate: -180, scale: 0.2, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1, transition: { duration: 1, ease: [0.34, 1.56, 0.64, 1] } },
    exit: { rotate: 180, scale: 0.2, opacity: 0, transition: { duration: 0.7, ease: "easeIn" } },
  },
  "rotate-corner": {
    initial: { rotate: 45, transformOrigin: "top left", opacity: 0 },
    animate: { rotate: 0, transformOrigin: "top left", opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
    exit: { rotate: -45, transformOrigin: "top left", opacity: 0, transition: { duration: 0.7, ease: "easeIn" } },
  },
  skew: {
    initial: { skewX: 25, x: "50%", opacity: 0 },
    animate: { skewX: 0, x: 0, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    exit: { skewX: -25, x: "-50%", opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } },
  },
  blur: {
    initial: { filter: "blur(30px)", opacity: 0, scale: 1.1 },
    animate: { filter: "blur(0px)", opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
    exit: { filter: "blur(30px)", opacity: 0, scale: 0.9, transition: { duration: 0.7, ease: "easeIn" } },
  },
  "blur-zoom": {
    initial: { filter: "blur(40px)", opacity: 0, scale: 0.3 },
    animate: { filter: "blur(0px)", opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
    exit: { filter: "blur(40px)", opacity: 0, scale: 1.4, transition: { duration: 0.7, ease: "easeIn" } },
  },
  bounce: {
    initial: { scale: 0.1, opacity: 0 },
    animate: { scale: [0.1, 1.12, 0.94, 1], opacity: 1, transition: { duration: 0.9, times: [0, 0.5, 0.75, 1] } },
    exit: { scale: 0.1, opacity: 0, transition: { duration: 0.5 } },
  },
  elastic: {
    initial: { scaleY: 0.2, scaleX: 1.5, opacity: 0 },
    animate: { scaleY: [0.2, 1.25, 0.9, 1], scaleX: [1.5, 0.85, 1.05, 1], opacity: 1, transition: { duration: 1, times: [0, 0.5, 0.8, 1] } },
    exit: { scaleY: 0.2, opacity: 0, transition: { duration: 0.5 } },
  },
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },
};

function getDynamicVariants(transitionName: string, duration: number = 1.0): Variants {
  const base = motionVariants[transitionName] || motionVariants.fade;
  const d = Math.max(0.2, Math.min(5.0, duration));

  return {
    initial: base.initial,
    animate: {
      ...base.animate,
      transition: {
        ...(base.animate as any)?.transition,
        duration: d,
      },
    },
    exit: {
      ...base.exit,
      transition: {
        ...(base.exit as any)?.transition,
        duration: Math.max(0.2, d * 0.8),
      },
    },
  };
}

export function ClientScreenPlayer({ screen, isPreviewMode = false }: ClientScreenPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const isEnabled = isPreviewMode || screen.status === "active";
  const activeContents = (screen.contents || []).filter((c) => c.isActive);
  const currentContent = activeContents[currentIndex];

  // Auto-sync / Realtime revalidation every 15s
  useEffect(() => {
    const syncInterval = setInterval(() => {
      router.refresh();
    }, 15000);
    return () => clearInterval(syncInterval);
  }, [router]);

  const goToNextContent = useCallback(() => {
    if (activeContents.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeContents.length);
  }, [activeContents.length]);

  // Listen to postMessage events from YouTube / Vimeo iframe players for 100% Video Completion
  useEffect(() => {
    if (!isEnabled || !currentContent || currentContent.type !== "video") return;

    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        // YouTube end event: info === 0 (YT.PlayerState.ENDED)
        if (data && (data.event === "onStateChange" && data.info === 0)) {
          goToNextContent();
        }
        // Vimeo end event: event === "finish" or event === "ended"
        if (data && (data.event === "finish" || data.event === "ended" || data.method === "ended")) {
          goToNextContent();
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [currentContent, isEnabled, goToNextContent]);

  // Playlist Rotation Loop
  useEffect(() => {
    if (!isEnabled || activeContents.length <= 1) return;

    const currentItem = activeContents[currentIndex];
    
    // FOR ALL VIDEO TYPES: Never cut off videos by a short timer!
    if (currentItem?.type === "video") {
      // 10-minute maximum safety fallback if a live stream or iframe never emits end event
      const fallbackTimer = setTimeout(() => {
        goToNextContent();
      }, 600000);
      return () => clearTimeout(fallbackTimer);
    }

    // For Image / Text / Web items: use programmed duration (min 3s)
    const durationMs = Math.max(3, currentItem?.duration || 10) * 1000;
    const timer = setTimeout(() => {
      goToNextContent();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [currentIndex, activeContents, isEnabled, goToNextContent]);

  // Screen Disabled View
  if (!isEnabled) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050811] text-white flex flex-col items-center justify-center p-8 select-none overflow-hidden font-sans">
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-12 text-center max-w-2xl space-y-6 shadow-2xl">
          <div className="size-20 rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <LockIcon className="size-10 text-rose-400" />
          </div>
          <div className="space-y-2">
            <span className="rounded-full border border-rose-500/30 bg-rose-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-400">
              Transmisión Bloqueada
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white">Pantalla Deshabilitada</h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Esta pantalla se encuentra suspendida o deshabilitada. Un Administrador debe habilitarla desde el panel de control.
            </p>
          </div>
          <div className="pt-2 text-xs text-white/40 font-mono">
            {screen.name} — {screen.location}
          </div>
        </div>
      </div>
    );
  }

  // Active Screen without Programmed Content View
  if (!currentContent) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050811] text-white flex flex-col items-center justify-center p-8 select-none overflow-hidden font-sans">
        <div className="text-center space-y-5 max-w-xl">
          <div className="size-24 rounded-3xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto animate-pulse shadow-2xl">
            <MonitorIcon className="size-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">{screen.name}</h2>
            <p className="text-sm text-primary font-bold flex items-center justify-center gap-1.5">
              <MapPinIcon className="size-4" /> {screen.location}
            </p>
          </div>
          <p className="text-xs text-white/40 font-mono pt-4 border-t border-white/10">
            Esperando programación de contenido por el usuario publicador...
          </p>
        </div>
      </div>
    );
  }

  const animDuration = (currentContent as any)?.transitionDuration || 1.0;
  const selectedVariants = getDynamicVariants(currentContent.transition, animDuration);

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const enableAudioOnUserInteraction = () => {
    setIsAudioMuted(false);
  };

  return (
    <div 
      onClick={enableAudioOnUserInteraction}
      className="fixed inset-0 z-50 w-screen h-screen bg-black select-none overflow-hidden flex items-center justify-center cursor-pointer"
    >
      {/* Floating Admin Preview Badge (subtle overlay during preview mode only) */}
      {isPreviewMode && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none opacity-85 backdrop-blur-md bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl animate-pulse">
          <EyeIcon className="size-4 text-amber-400" />
          <span>VISTA PREVIA ({currentIndex + 1}/{activeContents.length})</span>
        </div>
      )}

      {/* Floating Audio Unmute Indicator Banner (if browser blocked unmuted autoplay) */}
      {isAudioMuted && currentContent?.type === "video" && (
        <div className="fixed top-6 inset-x-0 mx-auto w-max z-50 pointer-events-none backdrop-blur-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-5 py-2 rounded-full text-xs font-black flex items-center gap-2.5 shadow-2xl animate-bounce">
          <Volume2Icon className="size-4 text-emerald-400 animate-pulse" />
          <span>Toca la pantalla para activar el audio de los videos</span>
        </div>
      )}

      {/* AnimatePresence for Framer Motion Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentContent.id + "-" + currentIndex}
          variants={selectedVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ perspective: 1200 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden"
        >
          {currentContent.type === "image" && (
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              {currentContent.url ? (
                <img 
                  src={currentContent.url} 
                  alt={currentContent.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="size-20 text-white/30 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white">{currentContent.title}</h2>
                </div>
              )}
              {currentContent.body && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-10 text-center">
                  <p className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                    {currentContent.body}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentContent.type === "video" && (
            <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden">
              {currentContent.url ? (
                (() => {
                  const media = formatVideoUrl(currentContent.url, "auto", isAudioMuted);
                  if (media.isIframe) {
                    return (
                      <div className="relative w-full h-full bg-black">
                        <iframe
                          src={media.url}
                          title={currentContent.title}
                          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                          className="w-full h-full border-0"
                        />
                        <div className="absolute inset-0 z-10 bg-transparent" />
                      </div>
                    );
                  }
                  return (
                    <video 
                      key={media.url}
                      ref={(el) => {
                        if (el) {
                          el.muted = isAudioMuted;
                          el.volume = 1.0;
                          const playPromise = el.play();
                          if (playPromise !== undefined) {
                            playPromise.catch(() => {
                              // Autoplay policy fallback: mute and play
                              el.muted = true;
                              setIsAudioMuted(true);
                              el.play().catch(() => {});
                            });
                          }
                        }
                      }}
                      src={media.url} 
                      autoPlay 
                      playsInline
                      onLoadedMetadata={(e) => {
                        e.currentTarget.muted = isAudioMuted;
                        e.currentTarget.volume = 1.0;
                        e.currentTarget.play().catch(() => {
                          e.currentTarget.muted = true;
                          setIsAudioMuted(true);
                          e.currentTarget.play().catch(() => {});
                        });
                      }}
                      onEnded={goToNextContent}
                      className="w-full h-full object-cover" 
                    />
                  );
                })()
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center p-8">
                  <VideoIcon className="size-20 text-white/30 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white">{currentContent.title}</h2>
                </div>
              )}
            </div>
          )}

          {currentContent.type === "text" && (
            <div className="w-full h-full bg-gradient-to-br from-[#0a0f24] via-[#050811] to-[#120e29] text-white flex flex-col items-center justify-center p-12 text-center space-y-8">
              <div className="size-24 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-2xl">
                <FileTextIcon className="size-12 text-amber-400" />
              </div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight max-w-5xl drop-shadow-md">
                {currentContent.title}
              </h1>
              {currentContent.body && (
                <p className="text-2xl sm:text-4xl font-semibold text-amber-200/90 leading-relaxed max-w-4xl bg-white/[0.03] border border-white/10 p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
                  "{currentContent.body}"
                </p>
              )}
            </div>
          )}

          {currentContent.type === "web" && (
            <div className="w-full h-full bg-white">
              {currentContent.url ? (
                <iframe 
                  src={currentContent.url} 
                  title={currentContent.title}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-center p-8">
                  <GlobeIcon className="size-20 text-white/30 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white">{currentContent.title}</h2>
                </div>
              )}
            </div>
          )}

          {currentContent.type === "split_anime" && (
            <AnimeTextSplit 
              imageUrl={currentContent.url || ""}
              title={currentContent.title}
              body={currentContent.body || ""}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
