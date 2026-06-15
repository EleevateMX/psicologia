'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { calcularEdad, type Nino } from '@/lib/dominio';
import { Cargando } from '@/components/Cargando';

export default function NinosPage() {
  const { db, cargado, cargarEjemplo } = useStore();
  if (!cargado) return <Cargando />;

  const ninos = [...db.ninos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  const activos = ninos.filter((n) => n.activo);
  const inactivos = ninos.filter((n) => !n.activo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            🐾 Cachorros del safari
          </h1>
          <p className="text-sm text-slate-500">{activos.length} en la expedición</p>
        </div>
        <Link href="/ninos/nuevo" className="btn-primary">
          + Nuevo
        </Link>
      </div>

      {ninos.length === 0 ? (
        <div className="card space-y-3 text-center text-sm text-slate-500">
          <p className="text-4xl">🦁🐘🦒</p>
          <p>Todavía no hay cachorros en el safari.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/ninos/nuevo" className="btn-primary">
              Crear la primera ficha
            </Link>
            <button onClick={cargarEjemplo} className="btn-secondary">
              Cargar datos de ejemplo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activos.map((n) => (
            <TarjetaNino key={n.id} nino={n} />
          ))}
        </div>
      )}

      {inactivos.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Archivados</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inactivos.map((n) => (
              <TarjetaNino key={n.id} nino={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TarjetaNino({ nino }: { nino: Nino }) {
  const edad = calcularEdad(nino.fecha_nacimiento);
  return (
    <Link
      href={`/ninos/${nino.id}`}
      className={`card flex items-center gap-3 transition hover:shadow-md ${
        !nino.activo ? 'opacity-60' : ''
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl">
        {nino.animal}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-800">{nino.nombre}</p>
        <p className="text-xs text-slate-500">
          {edad != null ? `${edad} años` : 'Edad —'}
          {nino.grupo ? ` · ${nino.grupo}` : ''}
        </p>
      </div>
    </Link>
  );
}
