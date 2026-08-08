import "dotenv/config";
import prisma from "../src/lib/prisma";
import crypto from "crypto";

async function main() {
  const screens = await prisma.screen.findMany();
  console.log(`Found ${screens.length} screens`);

  for (const sc of screens) {
    if (!sc.slug.startsWith("scr_tok_")) {
      const newToken = `scr_tok_${crypto.randomBytes(16).toString("hex")}`;
      await prisma.screen.update({
        where: { id: sc.id },
        data: { slug: newToken }
      });
      console.log(`Updated screen "${sc.name}" slug from "${sc.slug}" to "${newToken}"`);
    } else {
      console.log(`Screen "${sc.name}" already has secure token "${sc.slug}"`);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
