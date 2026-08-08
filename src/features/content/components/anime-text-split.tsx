"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { ImageIcon } from "lucide-react";
import { formatVideoUrl } from "@/lib/utils";

export type AnimeEffectType =
  | "stagger-letters"
  | "pop-elastic"
  | "neon-glow"
  | "slide-up"
  | "typewriter"
  | "wave-rotate"
  | "zoom-explode"
  | "flip-x"
  | "glitch-blur"
  | "spiral-reveal"
  | "bounce-drop"
  | "fade-in-words";

export const ANIME_TEXT_EFFECTS: { value: AnimeEffectType; label: string }[] = [
  { value: "stagger-letters", label: "💫 Rebote Estrellado (Stagger Elastic)" },
  { value: "pop-elastic", label: "🏀 Rebote 3D (Pop Elastic)" },
  { value: "neon-glow", label: "🌟 Destello Neón (Neon Pulse)" },
  { value: "slide-up", label: "⬆️ Elevación Cinemática (Slide Up)" },
  { value: "typewriter", label: "⌨️ Máquina de Escribir (Typewriter)" },
  { value: "wave-rotate", label: "🌊 Ola Ondulante (Wave Rotation)" },
  { value: "zoom-explode", label: "💥 Explosión Zoom (Zoom Explode)" },
  { value: "flip-x", label: "🔄 Giro 3D Horizontal (Flip 3D)" },
  { value: "glitch-blur", label: "🌫️ Desenfoque Cinemático (Glitch Blur)" },
  { value: "spiral-reveal", label: "🌀 Espiral Mágica (Spiral Reveal)" },
  { value: "bounce-drop", label: "💧 Caída en Cascada (Cascade Drop)" },
  { value: "fade-in-words", label: "✨ Aparición por Palabras (Word Fade)" },
];

interface AnimeTextSplitProps {
  imageUrl?: string;
  title: string;
  body?: string;
  effect?: string;
  bgType?: string;
  bgValue?: string;
}

export function AnimeTextSplit({
  imageUrl,
  title,
  body,
  effect = "stagger-letters",
  bgType = "gradient",
  bgValue,
}: AnimeTextSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset previous inline styles for anime letters
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll(".anime-letter");
      letters.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    }

    const currentEffect = effect as AnimeEffectType;

    // 1. Stagger Elastic
    if ((currentEffect === "stagger-letters" || !currentEffect) && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        translateY: [60, 0],
        translateZ: 0,
        opacity: [0, 1],
        scale: [0.3, 1],
        rotateZ: [-15, 0],
        easing: "easeOutElastic(1, .5)",
        duration: 1200,
        delay: anime.stagger(35, { start: 200 }),
      });
    }

    // 2. Pop Elastic
    if (currentEffect === "pop-elastic" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        scale: [0, 1.25, 1],
        opacity: [0, 1],
        rotate: [-25, 0],
        easing: "easeOutBack",
        duration: 1000,
        delay: anime.stagger(40, { start: 100 }),
      });
    }

    // 3. Neon Glow
    if (currentEffect === "neon-glow" && titleRef.current) {
      anime({
        targets: titleRef.current,
        textShadow: [
          "0 0 0px rgba(59,130,246,0)",
          "0 0 25px rgba(59,130,246,0.9), 0 0 50px rgba(245,158,11,0.8)",
          "0 0 10px rgba(59,130,246,0.6)",
        ],
        opacity: [0, 1],
        translateY: [-20, 0],
        easing: "easeOutSine",
        duration: 1400,
      });
    }

    // 4. Slide Up
    if (currentEffect === "slide-up" && titleRef.current) {
      anime({
        targets: titleRef.current,
        translateY: [80, 0],
        opacity: [0, 1],
        easing: "cubicBezier(0.16, 1, 0.3, 1)",
        duration: 1100,
      });
    }

    // 5. Typewriter
    if (currentEffect === "typewriter" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        opacity: [0, 1],
        easing: "steps(1)",
        duration: 50,
        delay: anime.stagger(50, { start: 100 }),
      });
    }

    // 6. Wave Rotation
    if (currentEffect === "wave-rotate" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        translateY: [-40, 0],
        rotate: [-30, 0],
        opacity: [0, 1],
        easing: "easeOutSine",
        duration: 900,
        delay: anime.stagger(40, { start: 100 }),
      });
    }

    // 7. Zoom Explode
    if (currentEffect === "zoom-explode" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        scale: [3, 1],
        opacity: [0, 1],
        easing: "easeOutQuart",
        duration: 1000,
        delay: anime.stagger(30, { start: 100 }),
      });
    }

    // 8. Flip 3D
    if (currentEffect === "flip-x" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        rotateX: [-90, 0],
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1100,
        delay: anime.stagger(40, { start: 100 }),
      });
    }

    // 9. Glitch Blur
    if (currentEffect === "glitch-blur" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        filter: ["blur(12px)", "blur(0px)"],
        opacity: [0, 1],
        translateY: [20, 0],
        easing: "easeOutQuad",
        duration: 900,
        delay: anime.stagger(35, { start: 100 }),
      });
    }

    // 10. Spiral Reveal
    if (currentEffect === "spiral-reveal" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        rotateZ: [360, 0],
        scale: [0, 1],
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: anime.stagger(40, { start: 100 }),
      });
    }

    // 11. Bounce Drop
    if (currentEffect === "bounce-drop" && titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        translateY: [-100, 0],
        opacity: [0, 1],
        easing: "easeOutBounce",
        duration: 1200,
        delay: anime.stagger(45, { start: 100 }),
      });
    }

    // 12. Fade In Words
    if (currentEffect === "fade-in-words" && titleRef.current) {
      anime({
        targets: titleRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        easing: "easeOutQuad",
        duration: 1000,
      });
    }

    // Subtitle Animation
    if (bodyRef.current) {
      anime({
        targets: bodyRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        easing: "easeOutQuad",
        duration: 900,
        delay: 500,
      });
    }

    // Glowing Line Animation
    if (lineRef.current) {
      anime({
        targets: lineRef.current,
        width: ["0%", "100%"],
        easing: "easeInOutQuart",
        duration: 1000,
        delay: 250,
      });
    }
  }, [title, body, effect]);

  // Wrap each word in a whitespace-nowrap inline-block container so words NEVER break mid-word!
  const renderTitleLetters = (text: string) => {
    const safeText = text || "Título del Anuncio";
    const words = safeText.split(" ");

    return words.map((word, wIdx) => (
      <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
        {word.split("").map((char, cIdx) => (
          <span key={cIdx} className="anime-letter inline-block">
            {char}
          </span>
        ))}
      </span>
    ));
  };

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const clean = url.toLowerCase().trim();
    return (
      clean.includes("youtube.com") ||
      clean.includes("youtu.be") ||
      clean.includes("vimeo.com") ||
      clean.includes("drive.google.com") ||
      clean.endsWith(".mp4") ||
      clean.endsWith(".webm") ||
      clean.endsWith(".mov") ||
      clean.endsWith(".m4v")
    );
  };

  const isVideo = imageUrl ? isVideoUrl(imageUrl) : false;
  const formattedMedia = isVideo ? formatVideoUrl(imageUrl!) : null;

  const getBackgroundStyle = (): React.CSSProperties => {
    if (bgType === "color") {
      return { backgroundColor: bgValue || "#0a0f24" };
    }
    if (bgType === "gradient") {
      return { background: bgValue || "linear-gradient(135deg, #0a0f24 0%, #050811 50%, #120e29 100%)" };
    }
    if (bgType === "image" && bgValue && (bgValue.startsWith("http") || bgValue.startsWith("/"))) {
      return { backgroundImage: `url(${bgValue})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    return { background: "linear-gradient(135deg, #0a0f24 0%, #050811 50%, #120e29 100%)" };
  };

  // Dynamic font size calculator so long titles & subtitles NEVER break or truncate!
  const getTitleFontSize = (text: string) => {
    const len = (text || "").length;
    if (len > 40) return "text-sm sm:text-base md:text-lg lg:text-xl font-black leading-snug";
    if (len > 25) return "text-base sm:text-lg md:text-xl lg:text-2xl font-black leading-snug";
    if (len > 15) return "text-lg sm:text-xl md:text-2xl lg:text-3xl font-black leading-tight";
    return "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight";
  };

  const getBodyFontSize = (text: string) => {
    const len = (text || "").length;
    if (len > 120) return "text-[10px] sm:text-xs md:text-xs font-medium leading-normal";
    if (len > 60) return "text-xs sm:text-xs md:text-sm font-medium leading-relaxed";
    return "text-xs sm:text-sm md:text-base font-medium leading-relaxed";
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col md:flex-row bg-[#060919] text-white select-none overflow-hidden"
    >
      {/* Left Column (50% Full-bleed Media Panel) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-black flex items-center justify-center">
        {imageUrl ? (
          isVideo && formattedMedia ? (
            formattedMedia.isIframe ? (
              <iframe
                src={formattedMedia.url}
                title={title || "Anime Split Video"}
                allow="autoplay; encrypted-media; fullscreen"
                className="w-full h-full border-0 pointer-events-none"
              />
            ) : (
              <video
                src={formattedMedia.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <img
              src={imageUrl}
              alt={title || "Anime Split Image"}
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          )
        ) : (
          <div className="text-center p-6 text-white/40 flex flex-col items-center justify-center">
            <ImageIcon className="size-14 mx-auto mb-3 opacity-40 text-primary" />
            <p className="text-xs font-medium text-white/60">Ingresa la URL de la imagen o video principal</p>
          </div>
        )}
      </div>

      {/* Right Column (50% Anime.js Typography Studio with Custom Background & Auto-scaling) */}
      <div
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-5 sm:p-7 md:p-10 relative overflow-hidden"
        style={getBackgroundStyle()}
      >
        {/* Dark overlay backdrop if background is image */}
        {bgType === "image" && bgValue && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-0" />
        )}

        {/* Glow ambient background sphere */}
        <div className="absolute top-1/4 right-10 size-64 rounded-full bg-primary/15 blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col justify-center max-h-full space-y-3.5 overflow-hidden">
          <h2
            ref={titleRef}
            className={`${getTitleFontSize(title)} text-white drop-shadow-2xl font-extrabold tracking-tight`}
          >
            {renderTitleLetters(title)}
          </h2>

          {/* Glowing Animated Accent Line */}
          <div
            ref={lineRef}
            className="h-1 bg-gradient-to-r from-primary via-amber-400 to-emerald-400 rounded-full w-full shadow-lg shrink-0 my-1"
          />

          {body && (
            <p
              ref={bodyRef}
              className={`${getBodyFontSize(body)} text-amber-200/95 bg-black/40 border border-white/15 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl shadow-2xl relative z-10 drop-shadow-md overflow-hidden text-ellipsis line-clamp-5`}
            >
              "{body}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
