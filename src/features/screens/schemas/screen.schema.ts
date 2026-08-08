import { z } from "zod";

export const createScreenSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "El identificador (slug/token) debe tener al menos 2 caracteres")
    .regex(/^[a-zA-Z0-9-_]+$/, "El identificador solo puede contener letras, números, guiones y guiones bajos"),
  location: z.string().min(2, "La ubicación es requerida"),
  description: z.string().optional(),
  status: z.enum(["active", "offline", "maintenance"]).default("active"),
  orientation: z.enum(["landscape", "portrait"]).default("landscape"),
  resolution: z.string().default("1920x1080"),
  refreshRate: z.number().min(5).default(30),
  volume: z.number().min(0).max(100).default(100),
  publisherId: z.string().optional().nullable(),
  isLocked: z.boolean().optional().default(false),
});

export type CreateScreenSchema = z.infer<typeof createScreenSchema>;

export const updateScreenSchema = createScreenSchema.partial().extend({
  id: z.string(),
});

export type UpdateScreenSchema = z.infer<typeof updateScreenSchema>;
