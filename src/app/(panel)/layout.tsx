import { BarraLateral, BarraInferior } from '@/components/Navegacion';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <BarraLateral />
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Encabezado móvil */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">☀️</span>
            <span className="font-bold text-brand-800">Bitácora de Verano</span>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-slate-500" type="submit">
              Salir
            </button>
          </form>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
      <BarraInferior />
    </div>
  );
}
