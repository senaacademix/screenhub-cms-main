import { getSession } from "@/proxy";

export default async function PublisherMediaPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Biblioteca Multimedia</h1>
      <p className="text-neutral-500 text-sm">Gestiona tus imágenes, videos y recursos gráficos.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-center" />
        ))}
      </div>
    </div>
  );
}
