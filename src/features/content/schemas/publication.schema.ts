import { z } from "zod";

export const createPublicationSchema = z.object({
  title: z.string().min(2, "El título de la publicación debe tener al menos 2 caracteres"),
  description: z.string().optional().nullable(),
});

export type CreatePublicationSchema = z.infer<typeof createPublicationSchema>;
