import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { PublisherContentPage } from "@/features/content";

export default async function PublisherContentRoutePage() {
  const session = await getSession();
  if (!session) return null;

  const screens = await prisma.screen.findMany({
    where: {
      publisherId: session.user.id,
    },
    include: {
      publisher: true,
      contents: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <PublisherContentPage screens={screens} />;
}
