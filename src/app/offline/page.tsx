export const metadata = { title: 'Sin conexión · Bitácora de Verano' };

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-5xl">🌤️</div>
      <h1 className="text-xl font-semibold text-slate-800">Sin conexión</h1>
      <p className="max-w-sm text-sm text-slate-600">
        No se pudo cargar esta vista porque no hay internet. Vuelve a
        intentarlo cuando recuperes la conexión; tus registros anteriores
        siguen guardados de forma segura.
      </p>
    </main>
  );
}
