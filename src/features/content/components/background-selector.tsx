"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaletteIcon, SparklesIcon, CheckIcon, ImageIcon } from "lucide-react";

export type BgType = "color" | "gradient" | "image";

export interface BackgroundSelectorProps {
  bgType?: string;
  bgValue?: string;
  onChange: (type: BgType, value: string) => void;
}

export const PRESET_COLORS = [
  { label: "Noche Obscura", value: "#0a0f24" },
  { label: "Azul Profundo", value: "#1e1b4b" },
  { label: "Esmeralda", value: "#022c22" },
  { label: "Rojo Rubí", value: "#450a0a" },
  { label: "Violeta Neón", value: "#311042" },
  { label: "Dorado Luxe", value: "#422006" },
  { label: "Carbón Muro", value: "#18181b" },
  { label: "Gris Titanio", value: "#27272a" },
];

export const PRESET_GRADIENTS = [
  {
    name: "Noche Cósmica",
    value: "linear-gradient(135deg, #0a0f24 0%, #050811 50%, #120e29 100%)",
  },
  {
    name: "Esmeralda Premium",
    value: "linear-gradient(135deg, #064e3b 0%, #022c22 50%, #0f172a 100%)",
  },
  {
    name: "Violeta Galáctico",
    value: "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 50%, #030712 100%)",
  },
  {
    name: "Fuego Neón",
    value: "linear-gradient(135deg, #831843 0%, #4c0519 50%, #0f172a 100%)",
  },
  {
    name: "Océano Profundo",
    value: "linear-gradient(135deg, #075985 0%, #0c4a6e 50%, #030712 100%)",
  },
  {
    name: "Dorado Lujo",
    value: "linear-gradient(135deg, #78350f 0%, #451a03 50%, #0f172a 100%)",
  },
  {
    name: "Atardecer Urbano",
    value: "linear-gradient(135deg, #9a3412 0%, #431407 50%, #0f172a 100%)",
  },
  {
    name: "Titanio Muro",
    value: "linear-gradient(135deg, #27272a 0%, #09090b 100%)",
  },
];

export function BackgroundSelector({ bgType = "gradient", bgValue, onChange }: BackgroundSelectorProps) {
  const currentType = (bgType as BgType) || "gradient";

  const handleTypeChange = (newType: BgType) => {
    if (newType === "color") {
      const defaultValue = bgValue && bgValue.startsWith("#") ? bgValue : PRESET_COLORS[0].value;
      onChange("color", defaultValue);
    } else if (newType === "gradient") {
      const defaultValue = bgValue && bgValue.includes("gradient") ? bgValue : PRESET_GRADIENTS[0].value;
      onChange("gradient", defaultValue);
    } else {
      const imageUrl = bgValue && (bgValue.startsWith("http://") || bgValue.startsWith("https://") || bgValue.startsWith("/")) ? bgValue : "";
      onChange("image", imageUrl);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <PaletteIcon className="size-4 text-primary" />
          <span>Fondo del Anuncio (Color / Degradado / Imagen)</span>
        </label>
      </div>

      {/* Tabs Selector: Color / Degradado / Imagen */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("color")}
          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            currentType === "color"
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <div className="size-3 rounded-full bg-indigo-500 border border-white/40" />
          <span>Color Sólido</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("gradient")}
          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            currentType === "gradient"
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <SparklesIcon className="size-3.5 text-amber-300 animate-pulse" />
          <span>Degradado</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("image")}
          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            currentType === "image"
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <ImageIcon className="size-3.5 text-cyan-400" />
          <span>Imagen de Fondo</span>
        </button>
      </div>

      {/* 1. SOLID COLOR PICKER */}
      {currentType === "color" && (
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {PRESET_COLORS.map((c) => {
              const isSelected = bgValue === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => onChange("color", c.value)}
                  className={`h-9 rounded-xl border relative flex items-center justify-center transition-transform hover:scale-105 ${
                    isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-white" : "border-border/60"
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {isSelected && <CheckIcon className="size-4 text-white drop-shadow-md" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Color Personalizado:</span>
            <input
              type="color"
              value={bgValue || "#0a0f24"}
              onChange={(e) => onChange("color", e.target.value)}
              className="size-8 rounded-lg cursor-pointer border border-border/60 bg-transparent p-0"
            />
            <Input
              type="text"
              value={bgValue || "#0a0f24"}
              onChange={(e) => onChange("color", e.target.value)}
              placeholder="#0a0f24"
              className="h-8 w-28 rounded-lg font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* 2. GRADIENT PRESETS */}
      {currentType === "gradient" && (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_GRADIENTS.map((g) => {
              const isSelected = bgValue === g.value;
              return (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => onChange("gradient", g.value)}
                  className={`h-12 rounded-xl border p-2 flex flex-col justify-end text-left relative overflow-hidden transition-all hover:opacity-95 ${
                    isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-white shadow-md" : "border-border/60"
                  }`}
                  style={{ background: g.value }}
                >
                  <span className="text-[10px] font-extrabold text-white drop-shadow-md truncate z-10">
                    {g.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 shadow-sm">
                      <CheckIcon className="size-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. BACKGROUND IMAGE URL */}
      {currentType === "image" && (
        <div className="space-y-2 pt-1">
          <Input
            type="url"
            placeholder="https://ejemplo.com/mi-imagen-de-fondo.jpg"
            value={
              bgValue && (bgValue.startsWith("http://") || bgValue.startsWith("https://") || bgValue.startsWith("/"))
                ? bgValue
                : ""
            }
            onChange={(e) => onChange("image", e.target.value)}
            className="h-10 rounded-xl border-border/60 font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground font-medium">
            🖼️ Ingresa la <strong>URL directa de la imagen</strong> (ej: Unsplash, Pexels o enlace web). Se aplicará un filtro de contraste para el texto.
          </p>
        </div>
      )}
    </div>
  );
}
