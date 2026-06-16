'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import {
  SEMAFORO_META,
  ANIMO_OPCIONES,
  formatearFecha,
  type Semaforo,
} from '@/lib/dominio';
import { SemaforoBadge, CategoriaBadge } from '@/components/Etiquetas';
import { LineaAnimo } from '@/components/Graficas';
import { AvisoConfidencialidad } from '@/components/AvisoConfidencialidad';

function hace(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

export default function CursoPage() {
  const { db, cargado } = useStore();
  if (!cargado) return <Cargando />;

  const desde = hace(14);
  const ninosActivos = db.ninos.filter((n) => n.activo && (!n.tipo || n.tipo === 'verano'));
  const alertasAbiertas = db.alertas.filter((a) => a.estado !== 'cerrada');
  const seguimientosPendientes = db.seguimientos.filter(
    (s) => s.estado === 'pendiente',
  );

  const obsRecientes = db.observaciones.filter((o) => o.fecha >= desde);
  const distribucion: Record<Semaforo, number> = { verde: 0, amarillo: 0, rojo: 0 };
  obsRecientes.forEach((o) => distribucion[o.semaforo]++);
  const totalObs = obsRecientes.length;

  const checkinsRecientes = db.checkins.filter((c) => c.fecha >= desde);
  const animoProm = checkinsRecientes.length
    ? checkinsRecientes.reduce((s, c) => s + c.animo, 0) / checkinsRecientes.length
    : null;
  const animoEmoji =
    animoProm != null
      ? ANIMO_OPCIONES[Math.min(4, Math.max(0, Math.round(animoProm) - 1))].emoji
      : '—';

  const ninoNombre = (id: string) =>
    db.ninos.find((n) => n.id === id)?.nombre ?? 'Cachorro';
  const ninoAnimal = (id: string) =>
    db.ninos.find((n) => n.id === id)?.animal ?? '🐾';

  const ultimasObs = [...db.observaciones]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 6);

  const porDia = new Map<string, { suma: number; n: number }>();
  checkinsRecientes.forEach((c) => {
    const e = porDia.get(c.fecha) ?? { suma: 0, n: 0 };
    e.suma += c.animo;
    e.n += 1;
    porDia.set(c.fecha, e);
  });
  const tendenciaAnimo = Array.from(porDia.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([fecha, v]) => ({ fecha, animo: v.suma / v.n }));

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-brand-600 hover:underline">
        ← Inicio
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            🦁 Curso de Verano · Safari
          </h1>
          <p className="text-sm text-slate-500">Resumen de las últimas 2 semanas</p>
        </div>
        <Link href="/ninos/nuevo" className="btn-primary">
          + Cachorro
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metrica titulo="Cachorros activos" valor={ninosActivos.length} emoji="🐾" href="/ninos" />
        <Metrica
          titulo="Alertas abiertas"
          valor={alertasAbiertas.length}
          emoji="🦁"
          href="/alertas"
          destacar={alertasAbiertas.length > 0}
        />
        <Metrica
          titulo="Seguimientos pendientes"
          valor={seguimientosPendientes.length}
          emoji="🤝"
          href="/seguimientos"
        />
        <Metrica titulo="Ánimo promedio" valor={animoEmoji} emoji="💗" href="/reportes" />
      </div>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          🚦 Semáforo de observaciones recientes
        </h2>
        {totalObs === 0 ? (
          <p className="text-sm text-slate-500">
            Aún no hay observaciones en este periodo.
          </p>
        ) : (
          <div className="space-y-3">
            {(['verde', 'amarillo', 'rojo'] as Semaforo[]).map((s) => {
              const n = distribucion[s];
              const pct = totalObs ? Math.round((n / totalObs) * 100) : 0;
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-24 text-sm">
                    {SEMAFORO_META[s].emoji} {SEMAFORO_META[s].etiqueta}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          s === 'verde' ? '#16a34a' : s === 'amarillo' ? '#eab308' : '#dc2626',
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm text-slate-500">
                    {n} · {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          📈 Ánimo del grupo (promedio diario)
        </h2>
        <LineaAnimo puntos={tendenciaAnimo} />
      </section>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Últimas observaciones
        </h2>
        {ultimasObs.length === 0 ? (
          <p className="text-sm text-slate-500">Sin registros todavía.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {ultimasObs.map((o) => (
              <li key={o.id} className="py-3">
                <Link
                  href={`/ninos/${o.nino_id}`}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span aria-hidden>{ninoAnimal(o.nino_id)}</span>
                  <span className="font-medium text-slate-800">
                    {ninoNombre(o.nino_id)}
                  </span>
                  <CategoriaBadge valor={o.categoria} />
                  <SemaforoBadge valor={o.semaforo} />
                  <span className="ml-auto text-xs text-slate-400">
                    {formatearFecha(o.fecha)}
                  </span>
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {o.descripcion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AvisoConfidencialidad />
    </div>
  );
}

function Metrica({
  titulo,
  valor,
  emoji,
  href,
  destacar,
}: {
  titulo: string;
  valor: number | string;
  emoji: string;
  href: string;
  destacar?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`card transition hover:shadow-md ${
        destacar ? 'border-red-300 bg-red-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
        <span className="text-2xl font-bold text-slate-800">{valor}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{titulo}</p>
    </Link>
  );
}
