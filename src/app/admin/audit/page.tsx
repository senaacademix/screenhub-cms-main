import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { AdminAuditPage } from "@/features/admin/components/admin-audit-page";

export default async function AdminAuditRoutePage() {
  const session = await getSession();
  if (!session || session.user.role !== "admin") return null;

  const publications = await prisma.publication.findMany({
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

  return <AdminAuditPage publications={publications} />;
}
