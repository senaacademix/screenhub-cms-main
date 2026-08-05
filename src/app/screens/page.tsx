import { getSession } from "@/proxy";

export default async function ScreensPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Pantallas</h1>
      <p className="text-neutral-500">Aquí podrás crear y administrar las pantallas del sistema.</p>
      <div className="mt-8 p-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">No hay pantallas creadas</h2>
        <p className="text-sm text-neutral-500 max-w-xs mt-1">
          Comienza creando tu primera pantalla para empezar a publicar contenido.
        </p>
        <button className="mt-6 px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-medium hover:opacity-90 transition-opacity">
          Crear Pantalla
        </button>
      </div>
    </div>
  );
}
