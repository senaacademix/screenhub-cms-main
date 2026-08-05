import { getSession } from "@/proxy";

export default async function MonitoringPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Monitoreo</h1>
      <p className="text-neutral-500">Visualización de variables ambientales y estado del sistema.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { label: "Temperatura", value: "24°C", status: "Normal", color: "text-emerald-500" },
          { label: "Humedad", value: "45%", status: "Normal", color: "text-emerald-500" },
          { label: "Dispositivos Activos", value: "12 / 15", status: "Atención", color: "text-amber-500" },
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <p className="text-sm text-neutral-500 font-medium">{item.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold">{item.value}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-neutral-50 dark:bg-neutral-800 ${item.color}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-8 bg-neutral-900 text-white rounded-3xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-xl font-bold">Estado Global</h2>
          <p className="text-neutral-400 text-sm mt-1">Sincronizado hace 2 minutos</p>
          <div className="mt-6 flex items-center gap-2 text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-sm font-medium">Sistemas operando correctamente</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
