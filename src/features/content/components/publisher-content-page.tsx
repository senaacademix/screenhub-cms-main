"use client";

import { useState } from "react";
import { Publication, ContentItem } from "@/generated/prisma";
import { CreatePublicationDialog } from "./create-publication-dialog";
import { CreateContentDialog } from "./create-content-dialog";
import { EditContentDialog } from "./edit-content-dialog";
import { 
  deletePublicationAction, 
  submitPublicationToReviewAction, 
  requestPublicationEditAction 
} from "../actions/publication.actions";
import { deleteContentAction, reorderPublicationContentsAction } from "../actions/content.actions";
import { 
  SparklesIcon, 
  Trash2Icon, 
  EditIcon,
  ImageIcon, 
  VideoIcon, 
  FileTextIcon, 
  GlobeIcon, 
  ClockIcon, 
  SendIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  LockIcon,
  HelpCircleIcon,
  PlusIcon,
  FolderIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  QrCodeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export type PublicationWithContents = Publication & {
  contents: ContentItem[];
};

interface PublisherContentPageProps {
  publications: PublicationWithContents[];
}

export function PublisherContentPage({ publications }: PublisherContentPageProps) {
  const [deletingPubId, setDeletingPubId] = useState<string | null>(null);
  const [submittingPubId, setSubmittingPubId] = useState<string | null>(null);
  const [requestingPubId, setRequestingPubId] = useState<string | null>(null);
  const [deletingContentId, setDeletingContentId] = useState<string | null>(null);

  // Expanded Publications State
  const [expandedPubIds, setExpandedPubIds] = useState<Record<string, boolean>>({});

  // Edit Content Dialog State
  const [selectedContentToEdit, setSelectedContentToEdit] = useState<ContentItem | null>(null);
  const [isEditContentOpen, setIsEditContentOpen] = useState(false);

  // Reordering state
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPubIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMoveContent = async (pub: PublicationWithContents, currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= pub.contents.length) return;

    const newContents = [...pub.contents];
    const [movedItem] = newContents.splice(currentIndex, 1);
    newContents.splice(targetIndex, 0, movedItem);

    const orderedIds = newContents.map((item) => item.id);
    setReorderingId(pub.id);
    try {
      const res = await reorderPublicationContentsAction(pub.id, orderedIds);
      if (res.success) {
        toast.success("Orden de contenidos actualizado");
      } else {
        toast.error(res.error || "No se pudo actualizar el orden");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setReorderingId(null);
    }
  };

  const handleDeletePublication = async (pubId: string) => {
    setDeletingPubId(pubId);
    try {
      const res = await deletePublicationAction(pubId);
      if (res.success) {
        toast.success("Publicación eliminada del banco");
      } else {
        toast.error(res.error || "No se pudo eliminar la publicación");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setDeletingPubId(null);
    }
  };

  const handleSubmitToReview = async (pubId: string) => {
    setSubmittingPubId(pubId);
    try {
      const res = await submitPublicationToReviewAction(pubId);
      if (res.success) {
        toast.success("Publicación enviada a auditoría del administrador");
      } else {
        toast.error(res.error || "No se pudo enviar a auditoría");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setSubmittingPubId(null);
    }
  };

  const handleRequestEdit = async (pubId: string) => {
    setRequestingPubId(pubId);
    try {
      const res = await requestPublicationEditAction(pubId);
      if (res.success) {
        toast.success("Solicitud de edición enviada al administrador");
      } else {
        toast.error(res.error || "No se pudo enviar la solicitud");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setRequestingPubId(null);
    }
  };

  const handleDeleteContentItem = async (contentId: string) => {
    setDeletingContentId(contentId);
    try {
      const res = await deleteContentAction(contentId);
      if (res.success) {
        toast.success("Contenido eliminado de la publicación");
      } else {
        toast.error(res.error || "No se pudo eliminar el contenido");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setDeletingContentId(null);
    }
  };

  const draftPubs = publications.filter((p) => p.status === "DRAFT");
  const reviewPubs = publications.filter((p) => p.status === "REVIEW");
  const publishedPubs = publications.filter((p) => p.status === "PUBLISHED");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <VideoIcon className="size-4 text-emerald-400" />;
      case "text": return <FileTextIcon className="size-4 text-amber-400" />;
      case "web": return <GlobeIcon className="size-4 text-sky-400" />;
      case "split_anime": return <SparklesIcon className="size-4 text-indigo-400" />;
      case "qr": return <QrCodeIcon className="size-4 text-violet-400" />;
      default: return <ImageIcon className="size-4 text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video": return "Video MP4";
      case "text": return "Aviso / Texto";
      case "web": return "Página Web";
      case "split_anime": return "Split Anime.js";
      case "qr": return "Código QR";
      default: return "Imagen / Banner";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Mis Publicaciones</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <SparklesIcon className="size-3" />
              Publicador
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Crea publicaciones compuestas por múltiples contenidos multimedia y envíalas a auditoría para que el Administrador las programe en pantallas.
          </p>
        </div>

        <CreatePublicationDialog />
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="draft" className="w-full space-y-6">
        <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-muted/60 p-1 rounded-2xl border border-border/60 max-w-lg">
          <TabsTrigger value="draft" className="rounded-xl text-xs font-bold gap-2">
            📝 En Edición ({draftPubs.length})
          </TabsTrigger>
          <TabsTrigger value="review" className="rounded-xl text-xs font-bold gap-2">
            ⏳ Auditoría ({reviewPubs.length})
          </TabsTrigger>
          <TabsTrigger value="published" className="rounded-xl text-xs font-bold gap-2">
            🚀 Publicadas ({publishedPubs.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: DRAFT (En Edición) */}
        <TabsContent value="draft" className="space-y-4">
          {draftPubs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-12 text-center text-muted-foreground backdrop-blur-md">
              <FolderIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No tienes publicaciones en borrador</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                Haz clic en "Nueva Publicación" para crear una campaña con múltiples contenidos multimedia.
              </p>
            </div>
          ) : (
            draftPubs.map((pub) => {
              const isExpanded = expandedPubIds[pub.id] !== false; // expanded by default
              return (
                <div key={pub.id} className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xl overflow-hidden space-y-3">
                  {/* Card Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 border-b border-border/40">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-extrabold text-foreground">{pub.title}</h3>
                        <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                          En Edición
                        </span>
                        {pub.rejectionReason && (
                          <span className="rounded-full border border-rose-500/40 bg-rose-500/15 px-2.5 py-0.5 text-xs font-bold text-rose-400 flex items-center gap-1">
                            <AlertTriangleIcon className="size-3" /> Devuelta por Admin
                          </span>
                        )}
                      </div>
                      {pub.description && <p className="text-xs text-muted-foreground">{pub.description}</p>}
                      {pub.rejectionReason && (
                        <p className="text-xs text-rose-300 font-semibold italic bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg mt-1">
                          Observación del Administrador: "{pub.rejectionReason}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/publisher/preview/${pub.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Probar vista previa de la secuencia completa en una nueva pestaña"
                      >
                        <Button variant="outline" size="sm" className="h-10 px-3 rounded-xl border-amber-500/40 text-amber-400 hover:bg-amber-500/15 font-bold text-xs gap-1.5 shadow-xs">
                          <EyeIcon className="size-4" />
                          <span>Vista Previa</span>
                        </Button>
                      </a>

                      <CreateContentDialog 
                        publicationId={pub.id} 
                        publicationTitle={pub.title} 
                      />

                      <Button
                        size="sm"
                        disabled={submittingPubId === pub.id || pub.contents.length === 0}
                        onClick={() => handleSubmitToReview(pub.id)}
                        className="h-10 px-4 rounded-xl font-bold text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                      >
                        <SendIcon className="size-3.5" />
                        <span>Enviar a Auditoría</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingPubId === pub.id}
                        onClick={() => handleDeletePublication(pub.id)}
                        className="h-10 w-10 p-0 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/15"
                        title="Eliminar publicación"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(pub.id)}
                        className="h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Contents Table Drawer */}
                  {isExpanded && (
                    <div className="p-5 pt-0">
                      <div className="overflow-hidden rounded-xl border border-border/50 bg-background/50">
                        <Table>
                          <TableHeader className="bg-muted/40">
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"># Orden</TableHead>
                              <TableHead className="py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contenido Multimedia</TableHead>
                              <TableHead className="py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Recurso / Detalle</TableHead>
                              <TableHead className="py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Duración</TableHead>
                              <TableHead className="py-2.5 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pub.contents.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground text-xs font-medium">
                                  <div className="flex flex-col items-center justify-center gap-2.5">
                                    <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
                                      ⚠️ Esta publicación no tiene contenidos asignados aún. Agrega al menos un recurso multimedia para enviarla a auditoría.
                                    </span>
                                    <div className="mt-1">
                                      <CreateContentDialog 
                                        publicationId={pub.id} 
                                        publicationTitle={pub.title} 
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              pub.contents.map((item, index) => (
                                <TableRow key={item.id} className="transition-colors hover:bg-accent/40 border-b border-border/30 last:border-0">
                                  <TableCell className="py-2.5 font-mono text-xs text-muted-foreground font-bold">
                                    <div className="flex items-center gap-2">
                                      <span>{index + 1}</span>
                                      {pub.status === "DRAFT" && pub.contents.length > 1 && (
                                        <div className="flex items-center gap-0.5">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={index === 0 || reorderingId === pub.id}
                                            onClick={() => handleMoveContent(pub, index, "up")}
                                            className="h-6 w-6 p-0 rounded-md hover:bg-primary/15 hover:text-primary disabled:opacity-30"
                                            title="Subir posición de diapositiva"
                                          >
                                            <ArrowUpIcon className="size-3.5" />
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={index === pub.contents.length - 1 || reorderingId === pub.id}
                                            onClick={() => handleMoveContent(pub, index, "down")}
                                            className="h-6 w-6 p-0 rounded-md hover:bg-primary/15 hover:text-primary disabled:opacity-30"
                                            title="Bajar posición de diapositiva"
                                          >
                                            <ArrowDownIcon className="size-3.5" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-2.5">
                                    <div className="flex items-center gap-2.5">
                                      <div className="size-7 rounded-lg bg-muted/60 border border-border/40 flex items-center justify-center shrink-0">
                                        {getTypeIcon(item.type)}
                                      </div>
                                      <span className="font-bold text-xs text-foreground">{item.title}</span>
                                    </div>
                                  </TableCell>

                                  <TableCell className="py-2.5">
                                    {item.url ? (
                                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="h-7 px-2 rounded-lg border-primary/30 text-primary font-bold text-[11px] gap-1">
                                          <ExternalLinkIcon className="size-3" /> Ver Recurso
                                        </Button>
                                      </a>
                                    ) : (
                                      <span className="text-xs text-muted-foreground italic truncate max-w-xs block">"{item.body}"</span>
                                    )}
                                  </TableCell>

                                  <TableCell className="py-2.5">
                                    {item.type === "video" ? (
                                      item.duration && item.duration > 0 ? (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 font-mono">
                                          <ClockIcon className="size-3 text-amber-400" /> {item.duration}s (Límite)
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                                          <SparklesIcon className="size-3" /> Auto (Video Completo)
                                        </span>
                                      )
                                    ) : (
                                      <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-bold font-mono">
                                        <ClockIcon className="size-3 text-primary" /> {item.duration}s
                                      </span>
                                    )}
                                  </TableCell>

                                  <TableCell className="py-2.5 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedContentToEdit(item);
                                          setIsEditContentOpen(true);
                                        }}
                                        className="h-7 w-7 p-0 rounded-lg text-amber-400 hover:bg-amber-500/15"
                                      >
                                        <EditIcon className="size-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={deletingContentId === item.id}
                                        onClick={() => handleDeleteContentItem(item.id)}
                                        className="h-7 w-7 p-0 rounded-lg text-rose-400 hover:bg-rose-500/15"
                                      >
                                        <Trash2Icon className="size-3.5" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </TabsContent>

        {/* Tab 2: REVIEW (En Auditoría) */}
        <TabsContent value="review" className="space-y-4">
          {reviewPubs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-12 text-center text-muted-foreground backdrop-blur-md">
              <FolderIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No tienes publicaciones en auditoría</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                Las publicaciones enviadas a revisión por el administrador se mostrarán aquí.
              </p>
            </div>
          ) : (
            reviewPubs.map((pub) => (
              <div key={pub.id} className="rounded-2xl border border-amber-500/30 bg-card/70 backdrop-blur-md p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-extrabold text-foreground">{pub.title}</h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
                        </span>
                        En Auditoría por Administrador
                      </span>
                    </div>
                    {pub.description && <p className="text-xs text-muted-foreground">{pub.description}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/publisher/preview/${pub.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Probar vista previa de la secuencia en una nueva pestaña"
                    >
                      <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-amber-500/40 text-amber-400 hover:bg-amber-500/15 font-bold text-xs gap-1.5 shadow-xs">
                        <EyeIcon className="size-3.5" />
                        <span>Vista Previa</span>
                      </Button>
                    </a>

                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground italic bg-muted/40 px-3 py-1.5 rounded-full border border-border/40">
                      <LockIcon className="size-3.5" /> Edición Bloqueada durante Revisión
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground font-medium">
                  Contenidos incluidos en esta publicación: <strong className="text-foreground">{pub.contents.length} ítems multimedia</strong>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Tab 3: PUBLISHED (Publicadas) */}
        <TabsContent value="published" className="space-y-4">
          {publishedPubs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-12 text-center text-muted-foreground backdrop-blur-md">
              <FolderIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">Aún no tienes publicaciones aprobadas</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                Las publicaciones aprobadas por el administrador aparecerán aquí listas para programar en pantallas.
              </p>
            </div>
          ) : (
            publishedPubs.map((pub) => (
              <div key={pub.id} className="rounded-2xl border border-emerald-500/30 bg-card/70 backdrop-blur-md p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-extrabold text-foreground">{pub.title}</h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2Icon className="size-3.5" /> Aprobada / Disponible para Programación
                      </span>
                    </div>
                    {pub.description && <p className="text-xs text-muted-foreground">{pub.description}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/publisher/preview/${pub.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Probar vista previa de la secuencia en una nueva pestaña"
                    >
                      <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-amber-500/40 text-amber-400 hover:bg-amber-500/15 font-bold text-xs gap-1.5 shadow-xs">
                        <EyeIcon className="size-3.5" />
                        <span>Vista Previa</span>
                      </Button>
                    </a>

                    {pub.editRequested ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-400">
                        <HelpCircleIcon className="size-3.5" /> Solicitud Enviada al Administrador
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={requestingPubId === pub.id}
                        onClick={() => handleRequestEdit(pub.id)}
                        className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 border-border/60"
                      >
                        <EditIcon className="size-3.5" />
                        <span>Solicitar Edición</span>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground font-medium">
                  Contenidos en secuencia: <strong className="text-foreground">{pub.contents.length} ítems multimedia</strong>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Content Item Dialog */}
      <EditContentDialog 
        content={selectedContentToEdit} 
        open={isEditContentOpen} 
        onOpenChange={setIsEditContentOpen} 
      />
    </div>
  );
}
