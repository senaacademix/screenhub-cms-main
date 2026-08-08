"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/proxy";
import { revalidatePath } from "next/cache";
import { createScreenSchema, CreateScreenSchema, updateScreenSchema, UpdateScreenSchema } from "../schemas/screen.schema";

import crypto from "crypto";

export async function generateScreenToken(): Promise<string> {
  return `scr_tok_${crypto.randomBytes(16).toString("hex")}`;
}

export async function createScreenAction(data: CreateScreenSchema) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  const parsed = createScreenSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Datos inválidos" };
  }

  try {
    // Generate secure token if slug is simple or not specified
    let finalSlug = parsed.data.slug;
    if (!finalSlug || finalSlug.length < 15) {
      finalSlug = await generateScreenToken();
    }

    const existing = await prisma.screen.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      finalSlug = await generateScreenToken();
    }

    const publisherId = parsed.data.publisherId === "unassigned" || !parsed.data.publisherId ? null : parsed.data.publisherId;

    const screen = await prisma.screen.create({
      data: {
        ...parsed.data,
        slug: finalSlug,
        publisherId,
      },
      include: {
        publisher: true,
      },
    });

    revalidatePath("/admin/screens");
    return { success: true, data: screen };
  } catch (error) {
    console.error("Error creating screen:", error);
    return { success: false, error: "Error al crear la pantalla" };
  }
}

export async function updateScreenAction(id: string, data: Partial<CreateScreenSchema>) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  try {
    if (data.slug) {
      const existing = await prisma.screen.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        return { success: false, error: "El slug especificado ya pertenece a otra pantalla." };
      }
    }

    const publisherId = data.publisherId === "unassigned" || data.publisherId === "" ? null : data.publisherId;

    const screen = await prisma.screen.update({
      where: { id },
      data: {
        ...data,
        publisherId,
      },
      include: {
        publisher: true,
      },
    });

    revalidatePath("/admin/screens");
    return { success: true, data: screen };
  } catch (error) {
    console.error("Error updating screen:", error);
    return { success: false, error: "Error al actualizar la pantalla" };
  }
}

export async function toggleScreenStatusAction(id: string, newStatus: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  try {
    const screen = await prisma.screen.update({
      where: { id },
      data: { status: newStatus },
      include: { publisher: true },
    });

    revalidatePath("/admin/screens");
    revalidatePath(`/screens/${screen.slug}`);
    return { success: true, data: screen };
  } catch (error) {
    console.error("Error toggling screen status:", error);
    return { success: false, error: "Error al cambiar el estado de la pantalla" };
  }
}

export async function deleteScreenAction(id: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  try {
    await prisma.screen.delete({
      where: { id },
    });

    revalidatePath("/admin/screens");
    return { success: true };
  } catch (error) {
    console.error("Error deleting screen:", error);
    return { success: false, error: "Error al eliminar la pantalla" };
  }
}

export async function toggleScreenLockAction(id: string, isLocked: boolean) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  try {
    const screen = await prisma.screen.update({
      where: { id },
      data: { isLocked },
      include: { publisher: true },
    });

    revalidatePath("/admin/screens");
    return { success: true, data: screen };
  } catch (error) {
    console.error("Error toggling screen lock:", error);
    return { success: false, error: "Error al cambiar el bloqueo de edición" };
  }
}

export async function rotateScreenTokenAction(id: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  try {
    const newToken = await generateScreenToken();
    const screen = await prisma.screen.update({
      where: { id },
      data: { slug: newToken },
      include: { publisher: true },
    });

    revalidatePath("/admin/screens");
    revalidatePath("/admin/schedule");
    return { success: true, data: screen };
  } catch (error) {
    console.error("Error rotating screen token:", error);
    return { success: false, error: "Error al generar nuevo token para la pantalla" };
  }
}



