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
    // Calculate order count inside publication
    const count = parsed.data.publicationId 
      ? await prisma.contentItem.count({ where: { publicationId: parsed.data.publicationId } })
      : 0;

    const contentItem = await prisma.contentItem.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        url: parsed.data.url,
        body: parsed.data.body,
        bgType: parsed.data.bgType,
        bgValue: parsed.data.bgValue,
        duration: parsed.data.duration,
        transition: parsed.data.transition,
        transitionDuration: parsed.data.transitionDuration,
        isActive: parsed.data.isActive,
        publicationId: parsed.data.publicationId || null,
        order: count,
        createdById: session.user.id,
      },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
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
      include: { publication: true },
    });

    if (!existing) {
      return { success: false, error: "El contenido no existe" };
    }

    if (session.user.role !== "admin" && existing.createdById !== session.user.id) {
      return { success: false, error: "No tienes permiso para editar este contenido" };
    }

    // Check if publication is locked
    if (session.user.role !== "admin" && existing.publication?.status !== "DRAFT") {
      return { success: false, error: "No puedes editar contenidos de una publicación en revisión o aprobada" };
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data,
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
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
      include: { publication: true },
    });

    if (!existing) {
      return { success: false, error: "El contenido no existe" };
    }

    if (session.user.role !== "admin" && existing.createdById !== session.user.id) {
      return { success: false, error: "No tienes permiso para eliminar este contenido" };
    }

    if (session.user.role !== "admin" && existing.publication?.status !== "DRAFT") {
      return { success: false, error: "No puedes eliminar contenidos de una publicación en revisión o aprobada" };
    }

    await prisma.contentItem.delete({
      where: { id },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    return { success: true };
  } catch (error) {
    console.error("Error deleting content:", error);
    return { success: false, error: "Error al eliminar el contenido" };
  }
}

export async function reorderPublicationContentsAction(publicationId: string, orderedContentIds: string[]) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!publication) {
      return { success: false, error: "La publicación no existe" };
    }

    if (session.user.role !== "admin" && publication.createdById !== session.user.id) {
      return { success: false, error: "Sin autorización" };
    }

    if (session.user.role !== "admin" && publication.status !== "DRAFT") {
      return { success: false, error: "Solo se pueden reordenar contenidos en estado Borrador" };
    }

    const updates = orderedContentIds.map((id, index) =>
      prisma.contentItem.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    return { success: true };
  } catch (error) {
    console.error("Error reordering contents:", error);
    return { success: false, error: "Error al reordenar los contenidos" };
  }
}
