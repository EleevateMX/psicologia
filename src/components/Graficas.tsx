'use client';

import { ANIMO_OPCIONES, type Semaforo, SEMAFORO_META } from '@/lib/dominio';

// ---------------------------------------------------------------------------
// Gráfica de evolución de puntaje de un instrumento (una persona)
// ---------------------------------------------------------------------------

export function LineaEvaluaciones({
  puntos,
  min = 0,
  max = 5,
}: {
  puntos: { fecha: string; puntaje: number }[];
  min?: number;
  max?: number;
}) {
  if (puntos.length === 0) {
    return <p className="text-sm text-slate-400">Sin evaluaciones todavía.</p>;
  }
  const W = 320;
  const H = 80;
  const PX = 8;
  const PY = 10;
  const n = puntos.length;
  const rango = max - min || 1;
  const xp = (i: number) => (n === 1 ? W / 2 : PX + (i * (W - PX * 2)) / (n - 1));
  const yp = (v: number) => H - PY - ((v - min) / rango) * (H - PY * 2);

  const linea = puntos.map((p, i) => `${xp(i)},${yp(p.puntaje)}`).join(' ');

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full min-w-[220px]" aria-label="Evolución del puntaje">
        {/* línea de referencia de 0 */}
        {[min, (min + max) / 2, max].map((lvl) => (
          <line
            key={lvl}
            x1={0} x2={W} y1={yp(lvl)} y2={yp(lvl)}
            stroke="#e2e8f0" strokeWidth={1}
          />
        ))}
        {n > 1 && (
          <polyline
            points={linea}
            fill="none"
            stroke="#4f7728"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {puntos.map((p, i) => (
          <g key={i}>
            <circle cx={xp(i)} cy={yp(p.puntaje)} r={4} fill="#4f7728" />
            <text x={xp(i)} y={yp(p.puntaje) - 6} textAnchor="middle" fontSize="10" fill="#374151">
              {p.puntaje}
            </text>
          </g>
        ))}
        {/* etiqueta de la primera y última fecha */}
        {n >= 1 && (
          <text x={xp(0)} y={H} textAnchor="start" fontSize="8" fill="#9ca3af">
            {puntos[0].fecha.slice(5)}
          </text>
        )}
        {n >= 2 && (
          <text x={xp(n - 1)} y={H} textAnchor="end" fontSize="8" fill="#9ca3af">
            {puntos[n - 1].fecha.slice(5)}
          </text>
        )}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Barras horizontales de comparación (puntaje más reciente por persona)
// ---------------------------------------------------------------------------

export function BarrasComparacion({
  filas,
  min = 0,
  max = 5,
}: {
  filas: { nombre: string; puntaje: number; clase: string; etiqueta: string }[];
  min?: number;
  max?: number;
}) {
  if (filas.length === 0) return null;
  const rango = max - min || 1;
  return (
    <div className="space-y-2">
      {[...filas]
        .sort((a, b) => b.puntaje - a.puntaje)
        .map((f, i) => {
          const pct = Math.min(100, Math.max(0, ((f.puntaje - min) / rango) * 100));
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-28 shrink-0 truncate text-slate-700" title={f.nombre}>
                {f.nombre}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: f.clase.includes('green')
                      ? '#16a34a'
                      : f.clase.includes('yellow') || f.clase.includes('amber')
                      ? '#eab308'
                      : f.clase.includes('orange')
                      ? '#ea580c'
                      : f.clase.includes('red')
                      ? '#dc2626'
                      : '#6366f1',
                  }}
                />
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${f.clase}`}>
                {f.puntaje} · {f.etiqueta}
              </span>
            </div>
          );
        })}
    </div>
  );
}

/** Gráfica de línea del ánimo (1–5) a lo largo del tiempo. */
export function LineaAnimo({
  puntos,
}: {
  puntos: { fecha: string; animo: number }[];
}) {
  if (puntos.length === 0) {
    return (
      <p className="text-sm text-slate-400">Aún no hay check-ins para graficar.</p>
    );
  }
  const W = 320;
  const H = 90;
  const PX = 8;
  const PY = 10;
  const n = puntos.length;
  const x = (i: number) =>
    n === 1 ? W / 2 : PX + (i * (W - PX * 2)) / (n - 1);
  const y = (v: number) => H - PY - ((v - 1) / 4) * (H - PY * 2);

  const linea = puntos.map((p, i) => `${x(i)},${y(p.animo)}`).join(' ');

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-24 w-full min-w-[280px]"
        role="img"
        aria-label="Evolución del ánimo"
      >
        {[1, 3, 5].map((lvl) => (
          <line
            key={lvl}
            x1={0}
            x2={W}
            y1={y(lvl)}
            y2={y(lvl)}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}
        {n > 1 && (
          <polyline
            points={linea}
            fill="none"
            stroke="#4f7728"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {puntos.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.animo)} r={4} fill="#4f7728" />
            <text x={x(i)} y={y(p.animo) - 7} textAnchor="middle" fontSize="11">
              {ANIMO_OPCIONES[Math.round(p.animo) - 1]?.emoji ?? ''}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Barras horizontales de la distribución del semáforo. */
export function BarrasSemaforo({
  dist,
}: {
  dist: Record<Semaforo, number>;
}) {
  const total = dist.verde + dist.amarillo + dist.rojo;
  if (total === 0) {
    return <p className="text-sm text-slate-400">Sin observaciones todavía.</p>;
  }
  const color: Record<Semaforo, string> = {
    verde: '#16a34a',
    amarillo: '#eab308',
    rojo: '#dc2626',
  };
  return (
    <div className="space-y-2">
      {(['verde', 'amarillo', 'rojo'] as Semaforo[]).map((s) => {
        const pct = Math.round((dist[s] / total) * 100);
        return (
          <div key={s} className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">
              {SEMAFORO_META[s].emoji} {SEMAFORO_META[s].etiqueta}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: color[s] }}
              />
            </div>
            <span className="w-12 text-right text-xs text-slate-500">
              {dist[s]} · {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
