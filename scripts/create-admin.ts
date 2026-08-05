import "dotenv/config";
import { auth } from "../src/lib/auth";
import prisma from "../src/lib/prisma";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log("--- Crear Usuario Administrador ---");
    const name = await rl.question("Nombre: ");
    const email = await rl.question("Email: ");
    const password = await rl.question("Contraseña: ");

    if (!name || !email || !password) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }

    console.log(`\nIntentando crear usuario administrador con el correo: ${email}...`);

    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      // Mock request headers to satisfy better-auth internals if needed
      headers: new Headers({
        "x-better-auth-is-server": "true",
      }),
    });
    
    if (!res?.user?.id) {
      console.error("No se pudo obtener el ID del usuario creado. Respuesta:", res);
      return;
    }

    // Asegurarnos de que el usuario tenga el rol de 'admin' actualizándolo en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: res.user.id },
      data: { role: "admin" },
    });

    console.log("\n✅ Usuario administrador creado exitosamente:");
    console.log(`ID: ${updatedUser.id}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Rol: ${updatedUser.role}`);
    
  } catch (error: any) {
    console.error("\n❌ Error al crear el usuario administrador:");
    if (error?.message) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
