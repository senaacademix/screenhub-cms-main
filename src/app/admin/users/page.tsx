import { getSession } from "@/proxy";
import prisma from "@/lib/prisma";
import { UsersClientPage } from "@/features/admin/components/users-client-page";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) return null;

  // Fetch initial users from database
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <UsersClientPage initialUsers={users} />;
}
