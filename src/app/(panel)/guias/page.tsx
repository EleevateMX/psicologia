'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { BotonAccion } from '@/components/BotonAccion';
import { formatearFecha } from '@/lib/dominio';

export default function GuiasPage() {
  const { db, cargado, eliminarGuia, sembrarGuiaEstandar } = useStore();
  if (!cargado) return <Cargando />;

  const guias = [...db.guias].sort((a, b) => a.nombre.localeCompare(b.nombre));
  const totalPreguntas = (id: string) => {
    const g = db.guias.find((x) => x.id === id);
    return g ? g.secciones.reduce((s, sec) => s + sec.preguntas.length, 0) : 0;
  };
  const aplicaciones = (id: string) =>
    db.entrevistas.filter((e) => e.guia_id === id).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📝 Guías de entrevista</h1>
          <p className="text-sm text-slate-500">
            Plantillas que aplicas dentro de cada expediente.
          </p>
        </div>
        <Link href="/guias/nuevo" className="btn-primary">
          + Nueva guía
        </Link>
      </div>

      {guias.length === 0 ? (
        <div className="card space-y-3 text-center text-sm text-slate-500">
          <p className="text-4xl">📝</p>
          <p>Todavía no tienes guías de entrevista.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={sembrarGuiaEstandar} className="btn-primary">
              Cargar guía de anamnesis estándar
            </button>
            <Link href="/guias/nuevo" className="btn-secondary">
              Crear una desde cero
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {guias.map((g) => (
            <div key={g.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-slate-800">{g.nombre}</h2>
                  <p className="text-xs text-slate-500">
                    {g.secciones.length} secciones · {totalPreguntas(g.id)} preguntas ·{' '}
                    {aplicaciones(g.id)} aplicaciones · creada{' '}
                    {formatearFecha(g.created_at)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/guias/${g.id}/editar`}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <BotonAccion
                    accion={() => eliminarGuia(g.id)}
                    confirmar="¿Eliminar esta guía? Las entrevistas ya aplicadas se conservan."
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    Eliminar
                  </BotonAccion>
                </div>
              </div>
              {g.descripcion && (
                <p className="mt-1 text-sm text-slate-600">{g.descripcion}</p>
              )}
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {g.secciones.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                  >
                    {s.titulo}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
        Tip: crea una guía una sola vez y aplícala a cualquier persona desde su
        expediente. Cada entrevista guarda las respuestas por separado.
      </div>
    </div>
  );
}
