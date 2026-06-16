'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { BotonAccion } from '@/components/BotonAccion';
import { formatearFecha, interpretarConInstrumento } from '@/lib/dominio';

export default function EvaluacionesPage() {
  const { db, cargado, eliminarInstrumento } = useStore();
  if (!cargado) return <Cargando />;

  const instrumentos = [...db.instrumentos].sort((a, b) =>
    a.nombre.localeCompare(b.nombre),
  );
  const conteo = (id: string) =>
    db.evaluaciones.filter((e) => e.instrumento_id === id).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📋 Evaluaciones</h1>
          <p className="text-sm text-slate-500">
            Tus instrumentos para aplicar desde cualquier expediente.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/evaluaciones/catalogo" className="btn-secondary text-sm">
            📚 Catálogo
          </Link>
          <Link href="/evaluaciones/nuevo" className="btn-primary">
            + Instrumento
          </Link>
        </div>
      </div>

      {instrumentos.length === 0 ? (
        <div className="card space-y-3 text-center text-sm text-slate-500">
          <p className="text-4xl">📋</p>
          <p>Todavía no tienes instrumentos de evaluación.</p>
          <Link href="/evaluaciones/nuevo" className="btn-primary">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {instrumentos.map((inst) => (
            <div key={inst.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-slate-800">{inst.nombre}</h2>
                  <p className="text-xs text-slate-500">
                    {inst.items.length} ítems · {conteo(inst.id)} aplicaciones ·{' '}
                    creado {formatearFecha(inst.created_at)}
                  </p>
                </div>
                <BotonAccion
                  accion={() => eliminarInstrumento(inst.id)}
                  confirmar="¿Eliminar este instrumento? Las evaluaciones ya aplicadas se conservan."
                  className="text-xs text-slate-400 hover:text-red-600"
                >
                  Eliminar
                </BotonAccion>
              </div>
              {inst.descripcion && (
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{inst.descripcion}</p>
              )}
              {inst.interpretaciones && inst.interpretaciones.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {inst.interpretaciones.map((r) => (
                    <span
                      key={r.etiqueta}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${r.clase}`}
                    >
                      {r.desde}–{r.hasta}: {r.etiqueta}
                    </span>
                  ))}
                </div>
              )}
              {inst.fuente && (
                <p className="mt-1 text-[10px] text-slate-400">
                  Fuente: {inst.fuente}
                </p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
                  Ver ítems
                </summary>
                <ul className="mt-1 list-decimal space-y-0.5 pl-5 text-xs text-slate-600">
                  {inst.items.map((it) => (
                    <li key={it.id}>
                      {it.texto}
                      {it.inverso && <span className="ml-1 italic text-slate-400">(inv.)</span>}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
