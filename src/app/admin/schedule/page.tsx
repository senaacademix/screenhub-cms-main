import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { AdminSchedulePage } from "@/features/admin/components/admin-schedule-page";

export default async function AdminScheduleRoutePage() {
  const session = await getSession();
  if (!session || session.user.role !== "admin") return null;

  const screens = await prisma.screen.findMany({
    include: {
      schedules: {
        include: {
          publication: {
            include: {
              createdBy: true,
              contents: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const publishedPublications = await prisma.publication.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      createdBy: true,
      contents: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AdminSchedulePage screens={screens} publishedPublications={publishedPublications} />;
}
