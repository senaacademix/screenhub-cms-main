import { getSession } from "@/proxy";

export default async function GenericDemoPage({ title, description }: { title: string, description: string }) {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-neutral-500 text-sm">{description}</p>
      <div className="mt-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
         <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-2xl mb-4" />
         <p className="text-neutral-400 font-medium">Esta sección está en desarrollo</p>
      </div>
    </div>
  );
}
