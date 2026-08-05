import { z } from "zod";

export const roleEnum = z.enum(["admin", "publisher"]);

export const createUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: roleEnum,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserRoleSchema = z.object({
  role: roleEnum,
});

export type UpdateUserRoleSchema = z.infer<typeof updateUserRoleSchema>;
