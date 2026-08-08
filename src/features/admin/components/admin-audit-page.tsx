"use client";

import { useState } from "react";
import { Publication, ContentItem, User } from "@/generated/prisma";
import { 
  approvePublicationAction, 
  rejectPublicationAction, 
  adminSetPublicationStatusAction 
} from "@/features/content/actions/publication.actions";
import { 
  CheckCircle2Icon, 
  XCircleIcon, 
  EyeIcon, 
  ClockIcon, 
  UserIcon, 
  ShieldCheckIcon,
  HelpCircleIcon,
  VideoIcon,
  ImageIcon,
  FileTextIcon,
  GlobeIcon,
  ExternalLinkIcon,
  FolderIcon,
  ChevronDownIcon,
  ChevronUpIcon
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type PublicationWithDetails = Publication & {
  createdBy?: User | null;
  contents: ContentItem[];
};

interface AdminAuditPageProps {
  publications: PublicationWithDetails[];
}

export function AdminAuditPage({ publications }: AdminAuditPageProps) {
  const [actionId, setActionId] = useState<string | null>(null);
  const [expandedPubIds, setExpandedPubIds] = useState<Record<string, boolean>>({});

  // Rejection Dialog State
  const [rejectItem, setRejectItem] = useState<PublicationWithDetails | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedPubIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await approvePublicationAction(id);
      if (res.success) {
        toast.success("¡Publicación aprobada exitosamente!");
      } else {
        toast.error(res.error || "No se pudo aprobar la publicación");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setActionId(null);
    }
  };

  const handleOpenReject = (item: PublicationWithDetails) => {
    setRejectItem(item);
    setRejectionReason("");
    setIsRejectOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectItem) return;
    setActionId(rejectItem.id);
    try {
      const res = await rejectPublicationAction(rejectItem.id, rejectionReason);
      if (res.success) {
        toast.success("Publicación devuelta a edición con las observaciones enviadas");
        setIsRejectOpen(false);
      } else {
        toast.error(res.error || "No se pudo rechazar la publicación");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setActionId(null);
    }
  };

  const handleReturnToDraft = async (id: string) => {
    setActionId(id);
    try {
      const res = await adminSetPublicationStatusAction(id, "DRAFT");
      if (res.success) {
        toast.success("Publicación devuelta a estado En Edición para el publicador");
      } else {
        toast.error(res.error || "No se pudo devolver la publicación");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setActionId(null);
    }
  };

  const reviewPubs = publications.filter((p) => p.status === "REVIEW");
  const editRequestedPubs = publications.filter((p) => p.status === "PUBLISHED" && p.editRequested);
  const publishedPubs = publications.filter((p) => p.status === "PUBLISHED" && !p.editRequested);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <VideoIcon className="size-4 text-emerald-400" />;
      case "text": return <FileTextIcon className="size-4 text-amber-400" />;
      case "web": return <GlobeIcon className="size-4 text-sky-400" />;
      default: return <ImageIcon className="size-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Auditoría de Publicaciones</h1>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400 flex items-center gap-1">
              <ShieldCheckIcon className="size-3" />
              Administración
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Audita publicaciones compuestas recibidas de publicadores, inspecciona sus contenidos multimedia y aprueba o rechaza la campaña.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="review" className="w-full space-y-6">
        <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-muted/60 p-1 rounded-2xl border border-border/60 max-w-xl">
          <TabsTrigger value="review" className="rounded-xl text-xs font-bold gap-2">
            ⏳ En Auditoría ({reviewPubs.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-xl text-xs font-bold gap-2">
            🙋‍♂️ Solicitudes Edición ({editRequestedPubs.length})
          </TabsTrigger>
          <TabsTrigger value="published" className="rounded-xl text-xs font-bold gap-2">
            🚀 Publicadas ({publishedPubs.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: REVIEW (Auditoría pendiente) */}
        <TabsContent value="review" className="space-y-4">
          {reviewPubs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-12 text-center text-muted-foreground backdrop-blur-md">
              <FolderIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No hay publicaciones pendientes de auditoría</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                Todas las solicitudes de publicación han sido revisadas.
              </p>
            </div>
          ) : (
            reviewPubs.map((pub) => {
              const isExpanded = expandedPubIds[pub.id] !== false;
              return (
                <div key={pub.id} className="rounded-2xl border border-amber-500/30 bg-card/70 backdrop-blur-md shadow-xl overflow-hidden space-y-3">
                  {/* Card Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-500/10 border-b border-amber-500/20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-extrabold text-foreground">{pub.title}</h3>
                        <span className="text-xs text-primary font-bold flex items-center gap-1">
                          <UserIcon className="size-3" />
                          Por: {pub.createdBy?.name || "Publicador"}
                        </span>
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                          Auditoría Pendiente
                        </span>
                      </div>
                      {pub.description && <p className="text-xs text-muted-foreground">{pub.description}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/publisher/preview/${pub.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Probar vista previa de la secuencia de esta publicación"
                      >
                        <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-amber-500/40 text-amber-400 hover:bg-amber-500/15 font-bold text-xs gap-1.5 shadow-xs">
                          <EyeIcon className="size-4 text-amber-400" />
                          <span>Vista Previa</span>
                        </Button>
                      </a>

                      <Button
                        size="sm"
                        disabled={actionId === pub.id}
                        onClick={() => handleApprove(pub.id)}
                        className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                      >
                        <CheckCircle2Icon className="size-4" />
                        <span>Aprobar Publicación</span>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={actionId === pub.id}
                        onClick={() => handleOpenReject(pub)}
                        className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 shadow-sm"
                      >
                        <XCircleIcon className="size-4" />
                        <span>Rechazar</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(pub.id)}
                        className="h-9 w-9 p-0 rounded-xl text-muted-foreground hover:text-foreground"
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pub.contents.map((item, index) => (
                              <TableRow key={item.id} className="transition-colors hover:bg-accent/40 border-b border-border/30 last:border-0">
                                <TableCell className="py-2.5 font-mono text-xs text-muted-foreground font-bold">
                                  {index + 1}
                                </TableCell>

                                <TableCell className="py-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="size-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
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
                                  <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-bold font-mono">
                                    <ClockIcon className="size-3 text-primary" /> {item.duration}s
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
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

        {/* Tab 2: Solicitudes de Edición */}
        <TabsContent value="requests" className="space-y-4">
          {editRequestedPubs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-12 text-center text-muted-foreground backdrop-blur-md">
              <FolderIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No hay solicitudes de edición pendientes</h3>
            </div>
          ) : (
            editRequestedPubs.map((pub) => (
              <div key={pub.id} className="rounded-2xl border border-amber-500/40 bg-card/70 backdrop-blur-md p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-extrabold text-foreground">{pub.title}</h3>
                      <span className="text-xs text-primary font-bold">Por: {pub.createdBy?.name || "Publicador"}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                      <HelpCircleIcon className="size-3.5" /> Solucita devolver a edición (Borrador)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/publisher/preview/${pub.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Probar vista previa de la secuencia de esta publicación"
                    >
                      <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-amber-500/40 text-amber-400 hover:bg-amber-500/15 font-bold text-xs gap-1.5 shadow-xs">
                        <EyeIcon className="size-4 text-amber-400" />
                        <span>Vista Previa</span>
                      </Button>
                    </a>

                    <Button
                      size="sm"
                      disabled={actionId === pub.id}
                      onClick={() => handleReturnToDraft(pub.id)}
                      className="h-9 px-4 rounded-xl font-bold text-xs bg-amber-500 text-black hover:bg-amber-400"
                    >
                      Devolver Publicación a Edición
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Tab 3: Publicadas */}
        <TabsContent value="published" className="space-y-4">
          {publishedPubs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-12 text-center text-muted-foreground backdrop-blur-md">
              <FolderIcon className="size-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No hay publicaciones aprobadas activas</h3>
            </div>
          ) : (
            publishedPubs.map((pub) => (
              <div key={pub.id} className="rounded-2xl border border-emerald-500/30 bg-card/70 backdrop-blur-md p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-extrabold text-foreground">{pub.title}</h3>
                      <span className="text-xs text-primary font-bold">Por: {pub.createdBy?.name || "Publicador"}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2Icon className="size-3.5" /> Aprobada / Publicada
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/publisher/preview/${pub.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Probar vista previa de la secuencia de esta publicación"
                    >
                      <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl border-amber-500/40 text-amber-400 hover:bg-amber-500/15 font-bold text-xs gap-1.5 shadow-xs">
                        <EyeIcon className="size-4 text-amber-400" />
                        <span>Vista Previa</span>
                      </Button>
                    </a>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={actionId === pub.id}
                      onClick={() => handleReturnToDraft(pub.id)}
                      className="h-9 px-4 rounded-xl font-bold text-xs border-border/60"
                    >
                      Despublicar y Devolver a Borrador
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Modal Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border/80 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Rechazar Publicación</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Proporciona una observación para que el publicador ajuste la campaña en borrador.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs font-bold text-foreground">Publicación: <span className="text-primary">{rejectItem?.title}</span></p>
            <Input 
              placeholder="Ej. Por favor agrega una imagen de mayor calidad y corrige los textos de la diapositiva 2."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="h-11 rounded-xl text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(false)} className="rounded-xl font-bold">
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmReject} disabled={actionId === rejectItem?.id} className="rounded-xl font-bold">
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
