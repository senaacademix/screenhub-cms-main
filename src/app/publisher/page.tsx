import { getSession } from "@/proxy";

export default async function PublisherPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl p-8 bg-card text-card-foreground rounded-3xl shadow-2xl border border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Panel de Publicador</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Gestión de contenidos y publicaciones</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold mb-2">Usuario Actual</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-xl font-bold">
                {session.user.name?.[0]}
              </div>
              <div>
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-neutral-500">{session.user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase">
                  {session.user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
