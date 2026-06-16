'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ESCALA_LIKERT, hoyISO } from '@/lib/dominio';

export function AplicarEvaluacion({ ninoId }: { ninoId: string }) {
  const { db, agregarEvaluacion } = useStore();
  const [abierto, setAbierto] = useState(false);
  const [instId, setInstId] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [respuestas, setRespuestas] = useState<Record<string, number | string>>({});
  const [notas, setNotas] = useState('');

  const instrumento = db.instrumentos.find((i) => i.id === instId);

  function reset() {
    setAbierto(false);
    setInstId('');
    setRespuestas({});
    setNotas('');
    setFecha(hoyISO());
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!instrumento) return;
    agregarEvaluacion({
      nino_id: ninoId,
      instrumento_id: instrumento.id,
      instrumento_nombre: instrumento.nombre,
      fecha,
      respuestas,
      notas: notas.trim() || null,
    });
    reset();
  }

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="btn-primary">
        + Aplicar evaluación
      </button>
    );
  }

  if (db.instrumentos.length === 0) {
    return (
      <div className="card text-sm text-slate-600">
        <p>Primero crea un instrumento de evaluación.</p>
        <Link href="/evaluaciones/nuevo" className="btn-primary mt-2 inline-flex">
          Crear instrumento
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={guardar} className="card space-y-4 border-brand-200">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ev_inst">
            Instrumento
          </label>
          <select
            id="ev_inst"
            className="input"
            value={instId}
            onChange={(e) => {
              setInstId(e.target.value);
              setRespuestas({});
            }}
            required
          >
            <option value="">Elige un instrumento…</option>
            {db.instrumentos.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ev_fecha">
            Fecha
          </label>
          <input
            id="ev_fecha"
            type="date"
            className="input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
      </div>

      {instrumento && (
        <div className="space-y-4">
          {instrumento.descripcion && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {instrumento.descripcion}
            </p>
          )}
          {instrumento.items.map((it, idx) => {
            const opciones = instrumento.opciones_escala ?? ESCALA_LIKERT;
            return (
            <div key={it.id}>
              <p className="mb-1 text-sm font-medium text-slate-700">
                {idx + 1}. {it.texto}
                {it.inverso && (
                  <span className="ml-1 text-[10px] text-slate-400">(inverso)</span>
                )}
              </p>
              {it.tipo === 'escala' ? (
                <div className="flex flex-wrap gap-1.5">
                  {opciones.map((op) => (
                    <label
                      key={op.valor}
                      className={`cursor-pointer rounded-lg border-2 px-2.5 py-1 text-xs transition ${
                        respuestas[it.id] === op.valor
                          ? 'border-brand-500 bg-brand-50 text-brand-800'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={it.id}
                        value={op.valor}
                        className="sr-only"
                        checked={respuestas[it.id] === op.valor}
                        onChange={() =>
                          setRespuestas((r) => ({ ...r, [it.id]: op.valor }))
                        }
                      />
                      {op.valor} · {op.etiqueta}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={2}
                  className="input"
                  value={(respuestas[it.id] as string) ?? ''}
                  onChange={(e) =>
                    setRespuestas((r) => ({ ...r, [it.id]: e.target.value }))
                  }
                  placeholder="Respuesta…"
                />
              )}
            </div>
            );
          })}

          <div>
            <label className="label" htmlFor="ev_notas">
              Notas de la evaluación
            </label>
            <textarea
              id="ev_notas"
              rows={2}
              className="input"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Conclusiones cualitativas (opcional)"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={!instrumento}>
          Guardar evaluación
        </button>
        <button type="button" onClick={reset} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
