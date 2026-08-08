import prisma from "@/lib/prisma";
import { ClientScreenPlayer } from "@/features/screens";
import { notFound } from "next/navigation";

interface PublicationPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicationPreviewPage({ params }: PublicationPreviewPageProps) {
  const { id } = await params;

  const publication = await prisma.publication.findUnique({
    where: { id },
    include: {
      contents: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!publication) {
    notFound();
  }

  const virtualScreen = {
    id: publication.id,
    name: `Vista Previa: ${publication.title}`,
    slug: publication.id,
    location: "Vista Previa de Publicación",
    orientation: "landscape",
    resolution: "1920x1080",
    status: "active",
    contents: publication.contents,
  };

  return <ClientScreenPlayer screen={virtualScreen as any} isPreviewMode={true} />;
}
