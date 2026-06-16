'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { BotonAccion } from '@/components/BotonAccion';
import { formatearFecha } from '@/lib/dominio';

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
            Tus instrumentos para aplicar a cada cachorro desde su expediente.
          </p>
        </div>
        <Link href="/evaluaciones/nuevo" className="btn-primary">
          + Instrumento
        </Link>
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
                <p className="mt-1 text-sm text-slate-600">{inst.descripcion}</p>
              )}
              <ul className="mt-2 list-decimal space-y-0.5 pl-5 text-sm text-slate-600">
                {inst.items.slice(0, 6).map((it) => (
                  <li key={it.id}>
                    {it.texto}{' '}
                    <span className="text-xs text-slate-400">
                      ({it.tipo === 'escala' ? 'escala' : 'texto'})
                    </span>
                  </li>
                ))}
                {inst.items.length > 6 && (
                  <li className="text-xs text-slate-400">
                    +{inst.items.length - 6} más…
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
