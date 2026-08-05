"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { SparklesIcon, ImageIcon } from "lucide-react";

export type AnimeEffectType = "stagger-letters" | "pop-elastic" | "neon-glow" | "slide-up";

interface AnimeTextSplitProps {
  imageUrl?: string;
  title: string;
  body?: string;
  effect?: AnimeEffectType;
}

export function AnimeTextSplit({
  imageUrl,
  title,
  body,
  effect = "stagger-letters",
}: AnimeTextSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset previous inline styles
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll(".anime-letter");
      letters.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    }

    if (effect === "stagger-letters" && titleRef.current) {
      const animation = anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        translateY: [60, 0],
        translateZ: 0,
        opacity: [0, 1],
        scale: [0.3, 1],
        rotateZ: [-15, 0],
        easing: "easeOutElastic(1, .5)",
        duration: 1200,
        delay: anime.stagger(40, { start: 200 }),
      });

      if (bodyRef.current) {
        anime({
          targets: bodyRef.current,
          opacity: [0, 1],
          translateY: [30, 0],
          easing: "easeOutQuad",
          duration: 900,
          delay: 600,
        });
      }

      if (lineRef.current) {
        anime({
          targets: lineRef.current,
          width: ["0%", "100%"],
          easing: "easeInOutQuart",
          duration: 1000,
          delay: 300,
        });
      }

      return () => {
        animation.pause();
      };
    }

    if (effect === "pop-elastic" && titleRef.current) {
      const animation = anime({
        targets: titleRef.current.querySelectorAll(".anime-letter"),
        scale: [0, 1.2, 1],
        opacity: [0, 1],
        rotate: [-30, 0],
        easing: "easeOutBack",
        duration: 1000,
        delay: anime.stagger(50, { start: 100 }),
      });

      if (bodyRef.current) {
        anime({
          targets: bodyRef.current,
          opacity: [0, 1],
          scale: [0.8, 1],
          easing: "easeOutBack",
          duration: 800,
          delay: 500,
        });
      }

      return () => {
        animation.pause();
      };
    }

    if (effect === "neon-glow" && titleRef.current) {
      const animation = anime({
        targets: titleRef.current,
        textShadow: [
          "0 0 0px rgba(59,130,246,0)",
          "0 0 20px rgba(59,130,246,0.9), 0 0 40px rgba(245,158,11,0.8)",
          "0 0 10px rgba(59,130,246,0.6)",
        ],
        opacity: [0, 1],
        translateY: [-20, 0],
        easing: "easeOutSine",
        duration: 1400,
      });

      if (lineRef.current) {
        anime({
          targets: lineRef.current,
          width: ["0%", "100%"],
          boxShadow: ["0 0 0px #f59e0b", "0 0 20px #f59e0b"],
          easing: "easeOutExpo",
          duration: 1200,
        });
      }

      return () => {
        animation.pause();
      };
    }

    if (effect === "slide-up" && titleRef.current) {
      const animation = anime({
        targets: titleRef.current,
        translateY: [80, 0],
        opacity: [0, 1],
        easing: "cubicBezier(0.16, 1, 0.3, 1)",
        duration: 1100,
      });

      if (bodyRef.current) {
        anime({
          targets: bodyRef.current,
          translateY: [60, 0],
          opacity: [0, 1],
          easing: "cubicBezier(0.16, 1, 0.3, 1)",
          duration: 1100,
          delay: 200,
        });
      }

      return () => {
        animation.pause();
      };
    }
  }, [title, body, effect]);

  // Wrap each letter in a span for Anime.js letter animations
  const renderTitleLetters = (text: string) => {
    const safeText = text || "Título del Anuncio";
    return safeText.split("").map((char, index) => (
      <span
        key={index}
        className="anime-letter inline-block"
        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col md:flex-row bg-[#060919] text-white select-none overflow-hidden"
    >
      {/* Left Column (50% Full-bleed Image) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-black flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Anime Split Image"}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
        ) : (
          <div className="text-center p-6 text-white/40">
            <ImageIcon className="size-16 mx-auto mb-3 opacity-40 text-primary" />
            <p className="text-sm font-medium text-white/60">Ingresa la URL de la imagen principal</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#060919]/90 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#060919]/90 md:hidden" />
      </div>

      {/* Right Column (50% Anime.js Typography Studio) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-8 md:p-14 space-y-6 bg-gradient-to-br from-[#090d24] via-[#050816] to-[#140e2b] relative">
        {/* Glow ambient background sphere */}
        <div className="absolute top-1/4 right-10 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-black uppercase tracking-wider">
            <SparklesIcon className="size-3.5 animate-pulse" />
            <span>Anime.js Text Studio</span>
          </div>

          <h2
            ref={titleRef}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xl"
          >
            {renderTitleLetters(title)}
          </h2>

          {/* Glowing Animated Accent Line */}
          <div
            ref={lineRef}
            className="h-1 bg-gradient-to-r from-primary via-amber-400 to-emerald-400 rounded-full w-full"
          />
        </div>

        {body && (
          <p
            ref={bodyRef}
            className="text-sm sm:text-lg font-medium text-white/80 leading-relaxed bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-xl relative z-10"
          >
            "{body}"
          </p>
        )}
      </div>
    </div>
  );
}
