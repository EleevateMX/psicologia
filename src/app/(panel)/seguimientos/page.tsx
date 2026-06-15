'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { formatearFecha, MEDIO_CONTACTO_META, type Seguimiento } from '@/lib/dominio';
import { BotonAccion } from '@/components/BotonAccion';

export default function SeguimientosPage() {
  const { db, cargado, cambiarEstadoSeguimiento } = useStore();
  if (!cargado) return <Cargando />;

  const seguimientos = [...db.seguimientos].sort((a, b) =>
    a.fecha < b.fecha ? 1 : -1,
  );
  const pendientes = seguimientos.filter((s) => s.estado === 'pendiente');
  const realizados = seguimientos.filter((s) => s.estado === 'realizado');

  const nombre = (id: string) => db.ninos.find((n) => n.id === id)?.nombre ?? 'Cachorro';
  const animal = (id: string) => db.ninos.find((n) => n.id === id)?.animal ?? '🐾';

  const Fila = ({ s, realizado }: { s: Seguimiento; realizado?: boolean }) => (
    <div className={`card ${realizado ? 'opacity-75' : ''}`}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href={`/ninos/${s.nino_id}`}
          className="font-medium text-brand-700 hover:underline"
        >
          {animal(s.nino_id)} {nombre(s.nino_id)}
        </Link>
        <span className="badge border-slate-200 bg-slate-50 text-slate-600">
          {MEDIO_CONTACTO_META[s.medio]}
        </span>
        <span className="ml-auto text-xs text-slate-400">
          {formatearFecha(s.fecha)}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-700">{s.resumen}</p>
      {s.acuerdos && (
        <p className="mt-1 text-sm text-slate-600">
          <span className="font-medium">Acuerdos: </span>
          {s.acuerdos}
        </p>
      )}
      {!realizado && (
        <div className="mt-2">
          <BotonAccion
            accion={() => cambiarEstadoSeguimiento(s.id, 'realizado')}
            className="btn-primary text-xs"
          >
            Marcar realizado
          </BotonAccion>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          🤝 Seguimiento con tutores
        </h1>
        <p className="text-sm text-slate-500">{pendientes.length} pendientes</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Pendientes</h2>
        {pendientes.length === 0 ? (
          <div className="card text-sm text-slate-500">
            No hay seguimientos pendientes.
          </div>
        ) : (
          pendientes.map((s) => <Fila key={s.id} s={s} />)
        )}
      </section>

      {realizados.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-500">Realizados</h2>
          {realizados.map((s) => (
            <Fila key={s.id} s={s} realizado />
          ))}
        </section>
      )}
    </div>
  );
}
