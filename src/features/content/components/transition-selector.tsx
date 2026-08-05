"use client";

import { motion } from "framer-motion";
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ZoomInIcon, 
  ZoomOutIcon, 
  RotateCwIcon, 
  LayersIcon, 
  CloudIcon, 
  ZapIcon, 
  CheckIcon,
  Maximize2Icon,
  Minimize2Icon,
  MoveRightIcon,
  MoveLeftIcon,
  SunIcon,
  CompassIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TransitionItem {
  id: string;
  name: string;
  category: "fade" | "slide" | "3d" | "special";
  icon: any;
  description: string;
}

export const TRANSITION_CARDS: TransitionItem[] = [
  // Fade
  { id: "fade", name: "Fade Standard", category: "fade", icon: SparklesIcon, description: "Disolución suave de opacidad" },
  { id: "fade-scale", name: "Fade Scale", category: "fade", icon: ZoomInIcon, description: "Disolución con ligera escala" },
  { id: "fade-up", name: "Fade Up", category: "fade", icon: ArrowUpIcon, description: "Desvanecimiento ascendente" },
  { id: "fade-down", name: "Fade Down", category: "fade", icon: ArrowDownIcon, description: "Desvanecimiento descendente" },

  // Slide & Push
  { id: "slide", name: "Slide Right", category: "slide", icon: ArrowRightIcon, description: "Desplazamiento a derecha" },
  { id: "slide-left", name: "Slide Left", category: "slide", icon: ArrowLeftIcon, description: "Desplazamiento a izquierda" },
  { id: "slide-up", name: "Slide Up", category: "slide", icon: ArrowUpIcon, description: "Desplazamiento ascendente" },
  { id: "slide-down", name: "Slide Down", category: "slide", icon: ArrowDownIcon, description: "Desplazamiento descendente" },
  { id: "push-right", name: "Push Right", category: "slide", icon: MoveRightIcon, description: "Empuje de pantalla derecha" },
  { id: "push-left", name: "Push Left", category: "slide", icon: MoveLeftIcon, description: "Empuje de pantalla izquierda" },

  // Zoom & Scale
  { id: "zoom", name: "Zoom In", category: "3d", icon: Maximize2Icon, description: "Ampliación desde el centro" },
  { id: "zoom-out", name: "Zoom Out", category: "3d", icon: Minimize2Icon, description: "Alejamiento en profundidad" },
  { id: "pulse-zoom", name: "Pulse Zoom", category: "3d", icon: SunIcon, description: "Latido pulsante dinámico" },

  // 3D Transforms
  { id: "flip", name: "Flip 3D Horizontal", category: "3d", icon: LayersIcon, description: "Giro 3D eje Y" },
  { id: "flip-y", name: "Flip 3D Vertical", category: "3d", icon: LayersIcon, description: "Giro 3D eje X" },
  { id: "flip-diagonal", name: "Flip Diagonal", category: "3d", icon: CompassIcon, description: "Giro 3D en diagonal" },
  { id: "rotate", name: "Spin Rotate", category: "special", icon: RotateCwIcon, description: "Rotación espiral" },
  { id: "rotate-corner", name: "Rotate Corner", category: "special", icon: RotateCwIcon, description: "Giro desde la esquina" },
  { id: "skew", name: "Skew Dynamic", category: "special", icon: LayersIcon, description: "Perspectiva inclinada 3D" },

  // Cinematic Special
  { id: "blur", name: "Blur Reveal", category: "special", icon: CloudIcon, description: "Desenfoque óptico" },
  { id: "blur-zoom", name: "Blur Zoom", category: "special", icon: CloudIcon, description: "Desenfoque zoom" },
  { id: "bounce", name: "Spring Bounce", category: "special", icon: SparklesIcon, description: "Entrada con rebote" },
  { id: "elastic", name: "Elastic Snap", category: "special", icon: SparklesIcon, description: "Tensión elástica" },
  { id: "none", name: "Instantáneo", category: "special", icon: ZapIcon, description: "Sin animación" },
];

interface TransitionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function TransitionSelector({ value, onChange, speed, onSpeedChange }: TransitionSelectorProps) {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-4 h-full">
      {/* AI Canvas Visual Cards Grid (24 Symmetrical Cards) */}
      <div className="flex-1 overflow-y-auto pr-1.5 p-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[calc(100vh-17rem)]">
        {TRANSITION_CARDS.map((card) => {
          const Icon = card.icon;
          const isSelected = value === card.id;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onChange(card.id)}
              className={`relative flex flex-col justify-between p-3 rounded-2xl border text-left transition-all duration-200 ease-out group hover:scale-[1.02] h-20 ${
                isSelected
                  ? "border-primary/60 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent ring-2 ring-primary/40 shadow-lg shadow-primary/10"
                  : "border-border/60 bg-card/90 backdrop-blur-sm hover:bg-card hover:border-border/90"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" 
                    : "bg-muted/80 text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
                }`}>
                  <Icon className="size-3.5" />
                </div>
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30"
                  >
                    <CheckIcon className="size-2.5 stroke-[3]" />
                  </motion.div>
                )}
              </div>

              <div>
                <span className={`text-xs font-black tracking-tight block truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {card.name}
                </span>
                <span className="text-[10px] text-muted-foreground line-clamp-1 font-medium leading-tight">
                  {card.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* AI Canvas Speed Controller Bar (Symmetrically Positioned at Bottom) */}
      <div className="shrink-0 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card/95 to-card p-3.5 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <SparklesIcon className="size-3 text-primary animate-pulse" />
            Velocidad de Animación Framer Motion
          </span>
          <span className="text-xs font-black text-primary font-mono bg-primary/15 border border-primary/30 px-2.5 py-0.5 rounded-full shadow-inner">
            {speed}s
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={speed === 0.5 ? "default" : "outline"}
            size="sm"
            onClick={() => onSpeedChange(0.5)}
            className={`h-9 text-xs font-extrabold rounded-xl transition-all ${
              speed === 0.5 ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:border-primary/50"
            }`}
          >
            🚀 Rápido (0.5s)
          </Button>
          <Button
            type="button"
            variant={speed === 1.0 ? "default" : "outline"}
            size="sm"
            onClick={() => onSpeedChange(1.0)}
            className={`h-9 text-xs font-extrabold rounded-xl transition-all ${
              speed === 1.0 ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:border-primary/50"
            }`}
          >
            ⚡ Normal (1.0s)
          </Button>
          <Button
            type="button"
            variant={speed === 1.8 ? "default" : "outline"}
            size="sm"
            onClick={() => onSpeedChange(1.8)}
            className={`h-9 text-xs font-extrabold rounded-xl transition-all ${
              speed === 1.8 ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:border-primary/50"
            }`}
          >
            🎬 Suave (1.8s)
          </Button>
        </div>
      </div>
    </div>
  );
}
