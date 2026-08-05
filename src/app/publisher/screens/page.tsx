import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { PublisherScreensClientPage } from "@/features/screens";

export default async function PublisherScreensPage() {
  const session = await getSession();
  if (!session) return null;

  // Query only screens assigned to this specific publisher
  const screens = await prisma.screen.findMany({
    where: {
      publisherId: session.user.id,
    },
    include: {
      publisher: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <PublisherScreensClientPage screens={screens} userName={session.user.name || "Publicador"} />;
}
