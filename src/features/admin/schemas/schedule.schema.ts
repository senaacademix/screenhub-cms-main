import { z } from "zod";

export const createScheduleSchema = z.object({
  screenId: z.string().min(1, "Debes seleccionar una pantalla objetivo"),
  publicationId: z.string().min(1, "Debes seleccionar una publicación aprobada"),
  startTime: z.string().default("00:00"),
  endTime: z.string().default("23:59"),
  daysOfWeek: z.string().default("ALL"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type CreateScheduleSchema = z.infer<typeof createScheduleSchema>;
