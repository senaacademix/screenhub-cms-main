"use server";

import prisma from "@/lib/prisma";

export async function hasUsers() {
  try {
    const count = await prisma.user.count();
    return count > 0;
  } catch (error) {
    console.error("Error checking for users:", error);
    return true; // Default to true on error to prevent unauthorized admin creation
  }
}
