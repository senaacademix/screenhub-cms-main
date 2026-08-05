import { z } from "zod";

export const TRANSITION_OPTIONS = [
  { value: "fade", label: "✨ Disolución Estándar (Fade)" },
  { value: "fade-scale", label: "✨ Disolución con Zoom (Fade Scale)" },
  { value: "slide", label: "➡️ Desplazamiento a Derecha (Slide Right)" },
  { value: "slide-left", label: "⬅️ Desplazamiento a Izquierda (Slide Left)" },
  { value: "slide-up", label: "⬆️ Desplazamiento Arriba (Slide Up)" },
  { value: "slide-down", label: "⬇️ Desplazamiento Abajo (Slide Down)" },
  { value: "zoom", label: "🔍 Ampliación (Zoom In)" },
  { value: "zoom-out", label: "🔍 Alejamiento (Zoom Out)" },
  { value: "flip", label: "🔄 Giro 3D Horizontal (Flip 3D)" },
  { value: "flip-y", label: "↕️ Giro 3D Vertical (Flip Vertical)" },
  { value: "rotate", label: "🌀 Espiral y Rotación (Spin Rotate)" },
  { value: "blur", label: "🌫️ Desenfoque Cinemático (Blur Reveal)" },
  { value: "bounce", label: "🏀 Rebote Elástico (Spring Bounce)" },
  { value: "skew", label: "📐 Inclinación Perspectiva (Skew Dynamic)" },
  { value: "none", label: "⚡ Sin Transición (Instantáneo)" },
];

export const createContentSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  type: z.enum(["image", "video", "text", "web", "split_anime"]).default("image"),
  url: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  duration: z.number().min(3, "La duración mínima es de 3 segundos").default(10),
  transition: z.string().default("fade"),
  transitionDuration: z.number().min(0.2, "La animación mínima es 0.2s").max(5.0, "La animación máxima es 5s").default(1.0),
  screenId: z.string().min(1, "Debes seleccionar una pantalla"),
  isActive: z.boolean().default(true),
});

export type CreateContentSchema = z.infer<typeof createContentSchema>;
