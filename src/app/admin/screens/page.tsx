import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { ScreensClientPage } from "@/features/screens";

export default async function AdminScreensPage() {
  const session = await getSession();
  if (!session) return null;

  const screens = await prisma.screen.findMany({
    include: { publisher: true },
    orderBy: { createdAt: "desc" },
  });

  const publishers = await prisma.user.findMany({
    where: { role: "publisher" },
    orderBy: { name: "asc" },
  });

  return <ScreensClientPage initialScreens={screens} publishers={publishers} />;
}
