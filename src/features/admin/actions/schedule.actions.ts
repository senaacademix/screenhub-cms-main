"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/proxy";
import { revalidatePath } from "next/cache";
import { createScheduleSchema, CreateScheduleSchema } from "../schemas/schedule.schema";

export async function addScheduleItemAction(data: CreateScheduleSchema) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Solo los administradores pueden programar publicaciones en pantallas" };
  }

  const parsed = createScheduleSchema.safeParse(data);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Datos inválidos para la programación";
    return { success: false, error: errorMsg };
  }

  const { screenId, publicationId, startTime, endTime, daysOfWeek, startDate, endDate } = parsed.data;

  try {
    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!publication) {
      return { success: false, error: "La publicación seleccionada no existe" };
    }

    if (publication.status !== "PUBLISHED") {
      return { success: false, error: "Solo se pueden programar publicaciones en estado Publicada" };
    }

    const screen = await prisma.screen.findUnique({
      where: { id: screenId },
    });

    if (!screen) {
      return { success: false, error: "La pantalla seleccionada no existe" };
    }

    // Compute next order index
    const count = await prisma.scheduleItem.count({
      where: { screenId },
    });

    const scheduleItem = await prisma.scheduleItem.create({
      data: {
        screenId,
        publicationId,
        order: count,
        isActive: true,
        startTime: startTime || "00:00",
        endTime: endTime || "23:59",
        daysOfWeek: daysOfWeek || "ALL",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    revalidatePath("/admin/schedule");
    revalidatePath(`/screens/${screen.slug}`);
    return { success: true, data: scheduleItem };
  } catch (error) {
    console.error("Error adding schedule item:", error);
    return { success: false, error: "Error al agregar la publicación a la programación" };
  }
}

export async function removeScheduleItemAction(scheduleItemId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Solo los administradores pueden gestionar la programación" };
  }

  try {
    const existing = await prisma.scheduleItem.findUnique({
      where: { id: scheduleItemId },
      include: { screen: true },
    });

    if (!existing) {
      return { success: false, error: "El ítem de programación no existe" };
    }

    await prisma.scheduleItem.delete({
      where: { id: scheduleItemId },
    });

    revalidatePath("/admin/schedule");
    revalidatePath(`/screens/${existing.screen.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error removing schedule item:", error);
    return { success: false, error: "Error al quitar la publicación de la programación" };
  }
}

export async function toggleScheduleActiveAction(scheduleItemId: string, isActive: boolean) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Solo los administradores pueden gestionar la programación" };
  }

  try {
    const updated = await prisma.scheduleItem.update({
      where: { id: scheduleItemId },
      data: { isActive },
      include: { screen: true },
    });

    revalidatePath("/admin/schedule");
    revalidatePath(`/screens/${updated.screen.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling schedule item active status:", error);
    return { success: false, error: "Error al actualizar la transmisión de la publicación" };
  }
}

export async function updateScheduleItemAction(scheduleItemId: string, data: CreateScheduleSchema) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Solo los administradores pueden gestionar la programación" };
  }

  const parsed = createScheduleSchema.safeParse(data);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Datos inválidos para la programación";
    return { success: false, error: errorMsg };
  }

  const { screenId, publicationId, startTime, endTime, daysOfWeek, startDate, endDate } = parsed.data;

  try {
    const updated = await prisma.scheduleItem.update({
      where: { id: scheduleItemId },
      data: {
        screenId,
        publicationId,
        startTime: startTime || "00:00",
        endTime: endTime || "23:59",
        daysOfWeek: daysOfWeek || "ALL",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: { screen: true },
    });

    revalidatePath("/admin/schedule");
    revalidatePath(`/screens/${updated.screen.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating schedule item:", error);
    return { success: false, error: "Error al actualizar la programación" };
  }
}
