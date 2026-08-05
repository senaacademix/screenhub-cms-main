"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/proxy";
import { revalidatePath } from "next/cache";
import { createContentSchema, CreateContentSchema } from "../schemas/content.schema";

export async function createContentAction(data: CreateContentSchema) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  const parsed = createContentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Datos inválidos" };
  }

  try {
    const screen = await prisma.screen.findUnique({
      where: { id: parsed.data.screenId },
    });

    if (!screen) {
      return { success: false, error: "La pantalla no existe" };
    }

    // Check ownership / admin privileges
    if (session.user.role !== "admin" && screen.publisherId !== session.user.id) {
      return { success: false, error: "No tienes permiso para editar esta pantalla" };
    }

    // Check lock status
    if (session.user.role !== "admin" && screen.isLocked) {
      return { success: false, error: "La edición de esta pantalla ha sido bloqueada por el administrador" };
    }

    // Count existing contents to compute order
    const count = await prisma.contentItem.count({
      where: { screenId: screen.id },
    });

    const contentItem = await prisma.contentItem.create({
      data: {
        ...parsed.data,
        order: count,
        createdById: session.user.id,
      },
    });

    revalidatePath("/publisher/screens");
    revalidatePath("/publisher/content");
    revalidatePath(`/screens/${screen.slug}`);
    return { success: true, data: contentItem };
  } catch (error) {
    console.error("Error creating content:", error);
    return { success: false, error: "Error al crear el contenido" };
  }
}

export async function updateContentAction(id: string, data: Partial<CreateContentSchema>) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const existing = await prisma.contentItem.findUnique({
      where: { id },
      include: { screen: true },
    });

    if (!existing) {
      return { success: false, error: "El contenido no existe" };
    }

    if (session.user.role !== "admin" && existing.screen.publisherId !== session.user.id) {
      return { success: false, error: "No tienes permiso para editar esta pantalla" };
    }

    if (session.user.role !== "admin" && existing.screen.isLocked) {
      return { success: false, error: "La edición de esta pantalla ha sido bloqueada por el administrador" };
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data,
    });

    revalidatePath("/publisher/screens");
    revalidatePath("/publisher/content");
    revalidatePath(`/screens/${existing.screen.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating content:", error);
    return { success: false, error: "Error al actualizar el contenido" };
  }
}

export async function deleteContentAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const existing = await prisma.contentItem.findUnique({
      where: { id },
      include: { screen: true },
    });

    if (!existing) {
      return { success: false, error: "El contenido no existe" };
    }

    if (session.user.role !== "admin" && existing.screen.publisherId !== session.user.id) {
      return { success: false, error: "No tienes permiso para editar esta pantalla" };
    }

    if (session.user.role !== "admin" && existing.screen.isLocked) {
      return { success: false, error: "La edición de esta pantalla ha sido bloqueada por el administrador" };
    }

    await prisma.contentItem.delete({
      where: { id },
    });

    revalidatePath("/publisher/screens");
    revalidatePath("/publisher/content");
    revalidatePath(`/screens/${existing.screen.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting content:", error);
    return { success: false, error: "Error al eliminar el contenido" };
  }
}

export async function toggleContentActiveAction(id: string, isActive: boolean) {
  return updateContentAction(id, { isActive });
}
