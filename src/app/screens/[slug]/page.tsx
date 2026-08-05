import prisma from "@/lib/prisma";
import { ClientScreenPlayer } from "@/features/screens";
import { notFound } from "next/navigation";

interface ScreenDisplayPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export default async function ScreenDisplayPage({ params, searchParams }: ScreenDisplayPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;

  const screen = await prisma.screen.findUnique({
    where: { slug },
    include: {
      contents: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!screen) {
    notFound();
  }

  const isPreviewMode = preview === "true";

  return <ClientScreenPlayer screen={screen} isPreviewMode={isPreviewMode} />;
}
