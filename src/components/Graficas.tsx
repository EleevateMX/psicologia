'use client';

import { ANIMO_OPCIONES, type Semaforo, SEMAFORO_META } from '@/lib/dominio';

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
