'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import {
  formatearFecha,
  interpretarConInstrumento,
  type Instrumento,
  type Evaluacion,
} from '@/lib/dominio';
import { LineaEvaluaciones, BarrasComparacion } from '@/components/Graficas';

// Rango de puntaje del instrumento (min y max posibles)
function rangoInstrumento(inst: Instrumento): [number, number] {
  const opciones = inst.opciones_escala;
  if (!opciones || opciones.length === 0) {
    if (inst.metodo_puntaje === 'suma') {
      const escala = inst.items.filter((i) => i.tipo === 'escala');
      return [escala.length * 1, escala.length * 5];
    }
    return [1, 5];
  }
  const min = Math.min(...opciones.map((o) => o.valor));
  const max = Math.max(...opciones.map((o) => o.valor));
  if (inst.metodo_puntaje === 'suma') {
    const escala = inst.items.filter((i) => i.tipo === 'escala');
    return [escala.length * min, escala.length * max];
  }
  return [min, max];
}

export default function AnalisisPage() {
  const { db, cargado } = useStore();
  const [instId, setInstId] = useState('');

  if (!cargado) return <Cargando />;

  const instrumento = db.instrumentos.find((i) => i.id === instId) ?? null;
  const [minPuntaje, maxPuntaje] = instrumento ? rangoInstrumento(instrumento) : [0, 5];

  // Estadísticas globales
  const totalAplicaciones = db.evaluaciones.length;
  const instrumentosUsados = new Set(db.evaluaciones.map((e) => e.instrumento_id)).size;
  const personasEvaluadas = new Set(db.evaluaciones.map((e) => e.nino_id)).size;

  // Evaluaciones del instrumento seleccionado
  const evsDelInst: Evaluacion[] = instrumento
    ? db.evaluaciones.filter((e) => e.instrumento_id === instrumento.id)
    : [];

  // Agrupar por persona
  const porPersona = new Map<string, Evaluacion[]>();
  for (const ev of evsDelInst) {
    const arr = porPersona.get(ev.nino_id) ?? [];
    arr.push(ev);
    porPersona.set(ev.nino_id, arr);
  }

  // Datos para el gráfico comparativo (puntaje más reciente por persona)
  const filasComparacion = Array.from(porPersona.entries())
    .map(([ninoId, evs]) => {
      const ultima = [...evs].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))[0];
      const persona = db.ninos.find((n) => n.id === ninoId);
      const interp = interpretarConInstrumento(ultima.puntaje, instrumento);
      return {
        nombre: persona?.nombre ?? 'Persona',
        puntaje: ultima.puntaje ?? 0,
        clase: interp.clase,
        etiqueta: interp.etiqueta,
      };
    })
    .filter((f) => f.puntaje != null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">📊 Tablero de análisis</h1>
        <p className="text-sm text-slate-500">
          Evolución de puntajes, comparación entre personas y tendencias.
        </p>
      </div>

      {/* Estadísticas globales */}
      <div className="grid grid-cols-3 gap-3">
        <Tarjeta titulo="Aplicaciones" valor={totalAplicaciones} />
        <Tarjeta titulo="Instrumentos usados" valor={instrumentosUsados} />
        <Tarjeta titulo="Personas evaluadas" valor={personasEvaluadas} />
      </div>

      {/* Selector de instrumento */}
      <div className="card space-y-2">
        <label className="label" htmlFor="an_inst">
          Selecciona un instrumento para analizar
        </label>
        {db.instrumentos.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aún no tienes instrumentos.{' '}
            <Link href="/evaluaciones/catalogo" className="text-brand-600 hover:underline">
              Importa uno del catálogo
            </Link>
            .
          </p>
        ) : (
          <select
            id="an_inst"
            className="input"
            value={instId}
            onChange={(e) => setInstId(e.target.value)}
          >
            <option value="">— Elige un instrumento —</option>
            {db.instrumentos.map((i) => {
              const n = db.evaluaciones.filter((e) => e.instrumento_id === i.id).length;
              return (
                <option key={i.id} value={i.id}>
                  {i.nombre} ({n} aplicación{n !== 1 ? 'es' : ''})
                </option>
              );
            })}
          </select>
        )}
      </div>

      {instrumento && (
        <>
          {/* Info + baremos del instrumento */}
          <div className="card space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-slate-800">{instrumento.nombre}</h2>
                <p className="text-xs text-slate-500">
                  {instrumento.items.filter((i) => i.tipo === 'escala').length} ítems de escala ·
                  puntaje por {instrumento.metodo_puntaje ?? 'promedio'} ·
                  rango {minPuntaje}–{maxPuntaje}
                </p>
              </div>
              <Link
                href="/evaluaciones"
                className="text-xs text-brand-600 hover:underline"
              >
                Ver instrumento →
              </Link>
            </div>
            {instrumento.interpretaciones && instrumento.interpretaciones.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {instrumento.interpretaciones.map((r) => (
                  <span
                    key={r.etiqueta}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${r.clase}`}
                  >
                    {r.desde}–{r.hasta}: {r.etiqueta}
                  </span>
                ))}
              </div>
            )}
            {instrumento.fuente && (
              <p className="text-[10px] text-slate-400">Fuente: {instrumento.fuente}</p>
            )}
          </div>

          {evsDelInst.length === 0 ? (
            <div className="card text-center text-sm text-slate-500">
              <p>
                Este instrumento aún no tiene aplicaciones. Aplícalo desde el{' '}
                <Link href="/pacientes" className="text-brand-600 hover:underline">
                  expediente de un paciente
                </Link>{' '}
                o una{' '}
                <Link href="/ninos" className="text-brand-600 hover:underline">
                  ficha del curso
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              {/* Comparación entre personas */}
              <section className="card space-y-4">
                <h2 className="text-sm font-semibold text-slate-700">
                  Comparación de puntajes (más reciente por persona)
                </h2>
                <BarrasComparacion
                  filas={filasComparacion}
                  min={minPuntaje}
                  max={maxPuntaje}
                />
              </section>

              {/* Evolución individual */}
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-700">
                  Evolución individual ({porPersona.size} persona
                  {porPersona.size !== 1 ? 's' : ''})
                </h2>
                {Array.from(porPersona.entries()).map(([ninoId, evs]) => {
                  const persona = db.ninos.find((n) => n.id === ninoId);
                  const serie = [...evs]
                    .sort((a, b) => (a.fecha < b.fecha ? -1 : 1))
                    .filter((e) => e.puntaje != null)
                    .map((e) => ({ fecha: e.fecha, puntaje: e.puntaje! }));
                  const ultima = serie[serie.length - 1];
                  const interp = interpretarConInstrumento(ultima?.puntaje ?? null, instrumento);
                  const href = persona?.tipo === 'clinico'
                    ? `/pacientes/${ninoId}`
                    : `/ninos/${ninoId}`;

                  return (
                    <div key={ninoId} className="card space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl" aria-hidden>
                            {persona?.tipo === 'clinico' ? '👤' : (persona?.animal ?? '🐾')}
                          </span>
                          <Link
                            href={href}
                            className="font-medium text-slate-800 hover:text-brand-700"
                          >
                            {persona?.nombre ?? 'Persona'}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2">
                          {ultima && (
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${interp.clase}`}>
                              {ultima.puntaje} · {interp.etiqueta}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {evs.length} aplicación{evs.length !== 1 ? 'es' : ''}
                          </span>
                        </div>
                      </div>

                      {serie.length > 0 && (
                        <LineaEvaluaciones
                          puntos={serie}
                          min={minPuntaje}
                          max={maxPuntaje}
                        />
                      )}

                      {/* Tabla de histórico */}
                      <details>
                        <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
                          Historial de aplicaciones
                        </summary>
                        <table className="mt-2 w-full text-xs">
                          <thead>
                            <tr className="border-b text-left text-slate-500">
                              <th className="pb-1 pr-4">Fecha</th>
                              <th className="pb-1 pr-4">Puntaje</th>
                              <th className="pb-1">Interpretación</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...evs]
                              .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
                              .map((ev) => {
                                const i2 = interpretarConInstrumento(ev.puntaje, instrumento);
                                return (
                                  <tr key={ev.id} className="border-b border-slate-50">
                                    <td className="py-1 pr-4 text-slate-600">
                                      {formatearFecha(ev.fecha)}
                                    </td>
                                    <td className="py-1 pr-4 font-medium text-slate-800">
                                      {ev.puntaje ?? '—'}
                                    </td>
                                    <td className="py-1">
                                      <span className={`rounded-full px-1.5 py-0.5 ${i2.clase}`}>
                                        {i2.etiqueta}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </details>
                    </div>
                  );
                })}
              </section>
            </>
          )}
        </>
      )}

      {!instrumento && totalAplicaciones === 0 && (
        <div className="card space-y-3 text-center text-sm text-slate-500">
          <p className="text-3xl">📊</p>
          <p>Cuando apliques evaluaciones a tus pacientes o fichas del curso,</p>
          <p>aquí verás la evolución de sus puntajes y comparaciones entre personas.</p>
          <Link href="/evaluaciones/catalogo" className="btn-primary inline-block">
            Importar escalas del catálogo
          </Link>
        </div>
      )}
    </div>
  );
}

function Tarjeta({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="card text-center">
      <p className="text-2xl font-bold text-brand-700">{valor}</p>
      <p className="text-[11px] text-slate-500">{titulo}</p>
    </div>
  );
}
