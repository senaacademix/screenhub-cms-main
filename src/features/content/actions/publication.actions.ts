"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/proxy";
import { revalidatePath } from "next/cache";
import { createPublicationSchema, CreatePublicationSchema } from "../schemas/publication.schema";

export async function createPublicationAction(data: CreatePublicationSchema) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  const parsed = createPublicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Datos de la publicación inválidos" };
  }

  try {
    const publication = await prisma.publication.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        status: "DRAFT",
        createdById: session.user.id,
      },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    return { success: true, data: publication };
  } catch (error) {
    console.error("Error creating publication:", error);
    return { success: false, error: "Error al crear la publicación" };
  }
}

export async function updatePublicationAction(id: string, data: Partial<CreatePublicationSchema>) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "La publicación no existe" };

    if (session.user.role !== "admin" && existing.createdById !== session.user.id) {
      return { success: false, error: "Sin autorización" };
    }

    if (session.user.role !== "admin" && existing.status !== "DRAFT") {
      return { success: false, error: "No puedes editar una publicación que está en revisión o publicada" };
    }

    const updated = await prisma.publication.update({
      where: { id },
      data,
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating publication:", error);
    return { success: false, error: "Error al actualizar la publicación" };
  }
}

export async function deletePublicationAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "La publicación no existe" };

    if (session.user.role !== "admin" && existing.createdById !== session.user.id) {
      return { success: false, error: "Sin autorización" };
    }

    if (session.user.role !== "admin" && existing.status !== "DRAFT") {
      return { success: false, error: "No puedes eliminar una publicación en revisión o publicada" };
    }

    await prisma.publication.delete({ where: { id } });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    return { success: true };
  } catch (error) {
    console.error("Error deleting publication:", error);
    return { success: false, error: "Error al eliminar la publicación" };
  }
}

export async function submitPublicationToReviewAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const existing = await prisma.publication.findUnique({
      where: { id },
      include: { contents: true },
    });

    if (!existing) return { success: false, error: "La publicación no existe" };

    if (session.user.role !== "admin" && existing.createdById !== session.user.id) {
      return { success: false, error: "Sin autorización" };
    }

    if (existing.contents.length === 0) {
      return { success: false, error: "Debes agregar al menos un contenido multimedia a la publicación antes de enviarla a auditoría" };
    }

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        status: "REVIEW",
        rejectionReason: null,
      },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error submitting publication to review:", error);
    return { success: false, error: "Error al enviar la publicación a auditoría" };
  }
}

export async function approvePublicationAction(id: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Solo los administradores pueden aprobar publicaciones" };
  }

  try {
    const updated = await prisma.publication.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        rejectionReason: null,
        editRequested: false,
      },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    revalidatePath("/admin/schedule");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error approving publication:", error);
    return { success: false, error: "Error al aprobar la publicación" };
  }
}

export async function rejectPublicationAction(id: string, reason?: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Solo los administradores pueden rechazar publicaciones" };
  }

  try {
    // Delete any active schedules using this publication
    await prisma.scheduleItem.deleteMany({
      where: { publicationId: id },
    });

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        status: "DRAFT",
        rejectionReason: reason || "Devuelta a edición por el administrador",
        editRequested: false,
      },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    revalidatePath("/admin/schedule");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error rejecting publication:", error);
    return { success: false, error: "Error al rechazar la publicación" };
  }
}

export async function requestPublicationEditAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "La publicación no existe" };

    if (existing.createdById !== session.user.id) {
      return { success: false, error: "Sin autorización" };
    }

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        editRequested: true,
      },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error requesting publication edit:", error);
    return { success: false, error: "Error al solicitar la devolución" };
  }
}

export async function adminSetPublicationStatusAction(id: string, status: "DRAFT" | "REVIEW" | "PUBLISHED") {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Solo los administradores pueden cambiar el estado" };
  }

  try {
    // If setting to a non-PUBLISHED status (e.g. DRAFT or REVIEW), automatically remove from all schedules
    if (status !== "PUBLISHED") {
      await prisma.scheduleItem.deleteMany({
        where: { publicationId: id },
      });
    }

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        status,
        editRequested: false,
      },
    });

    revalidatePath("/publisher/content");
    revalidatePath("/admin/audit");
    revalidatePath("/admin/schedule");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error setting publication status:", error);
    return { success: false, error: "Error al actualizar el estado" };
  }
}
