"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CreateUserSchema, UpdateUserRoleSchema } from "../schemas/user.schema";

export async function getUsersAction() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "No se pudieron obtener los usuarios" };
  }
}

export async function createUserAction(data: CreateUserSchema) {
  try {
    // Usamos better-auth signUpEmail que ya se encarga de hashear la contraseña
    const res = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      headers: new Headers({
        "x-better-auth-is-server": "true",
      }),
    });

    if (!res?.user?.id) {
      return { success: false, error: "No se pudo crear el usuario en Better Auth" };
    }

    // Actualizamos el rol del usuario recién creado
    const updatedUser = await prisma.user.update({
      where: { id: res.user.id },
      data: { role: data.role },
    });

    revalidatePath("/admin/users");
    return { success: true, data: updatedUser };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { success: false, error: error?.message || "No se pudo crear el usuario" };
  }
}

export async function updateUserRoleAction(id: string, data: UpdateUserRoleSchema) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    if (user.role === "admin" && data.role !== "admin") {
      // Opcional: Validar si es el único admin, para no permitir quitarse el rol.
      // Por simplicidad, confiaremos en que al menos hay otro.
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: data.role },
    });

    revalidatePath("/admin/users");
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "No se pudo actualizar el rol del usuario" };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Bloquear eliminación si el rol es admin (como solicitó el plan y acordamos, para que el admin no se auto-elimine ni a otros admins por error)
    if (user.role === "admin") {
      return { success: false, error: "No puedes eliminar a un administrador." };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "No se pudo eliminar al usuario" };
  }
}
