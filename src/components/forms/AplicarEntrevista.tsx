'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { hoyISO } from '@/lib/dominio';

export function AplicarEntrevista({ ninoId }: { ninoId: string }) {
  const { db, agregarEntrevista, sembrarGuiaEstandar } = useStore();
  const [abierto, setAbierto] = useState(false);
  const [guiaId, setGuiaId] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [notas, setNotas] = useState('');

  const guia = db.guias.find((g) => g.id === guiaId);

  function reset() {
    setAbierto(false);
    setGuiaId('');
    setRespuestas({});
    setNotas('');
    setFecha(hoyISO());
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!guia) return;
    agregarEntrevista({
      nino_id: ninoId,
      guia_id: guia.id,
      guia_nombre: guia.nombre,
      fecha,
      respuestas,
      notas: notas.trim() || null,
    });
    reset();
  }

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="btn-primary">
        + Aplicar guía de entrevista
      </button>
    );
  }

  if (db.guias.length === 0) {
    return (
      <div className="card space-y-2 text-sm text-slate-600">
        <p>Aún no tienes guías de entrevista.</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => sembrarGuiaEstandar()}
            className="btn-primary"
          >
            Cargar guía de anamnesis estándar
          </button>
          <button onClick={reset} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={guardar} className="card space-y-4 border-brand-200">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ent_guia">
            Guía
          </label>
          <select
            id="ent_guia"
            className="input"
            value={guiaId}
            onChange={(e) => {
              setGuiaId(e.target.value);
              setRespuestas({});
            }}
            required
          >
            <option value="">Elige una guía…</option>
            {db.guias.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ent_fecha">
            Fecha
          </label>
          <input
            id="ent_fecha"
            type="date"
            className="input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
      </div>

      {guia && (
        <div className="space-y-5">
          {guia.secciones.map((s) => (
            <fieldset key={s.id} className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                {s.titulo}
              </legend>
              {s.preguntas.map((p) => (
                <div key={p.id}>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {p.texto}
                  </label>
                  {p.ayuda && (
                    <p className="mb-1 text-xs text-slate-400">{p.ayuda}</p>
                  )}
                  <textarea
                    rows={2}
                    className="input"
                    value={respuestas[p.id] ?? ''}
                    onChange={(e) =>
                      setRespuestas((r) => ({ ...r, [p.id]: e.target.value }))
                    }
                    placeholder="Respuesta…"
                  />
                </div>
              ))}
            </fieldset>
          ))}

          <div>
            <label className="label" htmlFor="ent_notas">
              Notas / impresiones de la entrevista
            </label>
            <textarea
              id="ent_notas"
              rows={2}
              className="input"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones generales (opcional)"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={!guia}>
          Guardar entrevista
        </button>
        <button type="button" onClick={reset} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
