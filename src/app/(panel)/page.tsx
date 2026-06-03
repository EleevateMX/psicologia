import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  SEMAFORO_META,
  ANIMO_OPCIONES,
  formatearFecha,
  type Semaforo,
} from '@/lib/dominio';
import { SemaforoBadge, CategoriaBadge } from '@/components/Etiquetas';
import { AvisoConfidencialidad } from '@/components/AvisoConfidencialidad';

export const metadata = { title: 'Tablero · Bitácora de Verano' };
export const dynamic = 'force-dynamic';

export default async function TableroPage() {
  const supabase = await createClient();

  const [
    { count: totalNinos },
    { count: alertasAbiertas },
    { count: seguimientosPendientes },
    { data: obsRecientes },
    { data: checkinsRecientes },
    { data: ultimasObs },
  ] = await Promise.all([
    supabase.from('ninos').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('alertas').select('*', { count: 'exact', head: true }).neq('estado', 'cerrada'),
    supabase.from('seguimientos').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    supabase.from('observaciones').select('semaforo').gte('fecha', hace(14)),
    supabase.from('checkins_animo').select('animo').gte('fecha', hace(14)),
    supabase
      .from('observaciones')
      .select('*, ninos(nombre)')
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  const distribucion: Record<Semaforo, number> = { verde: 0, amarillo: 0, rojo: 0 };
  (obsRecientes ?? []).forEach((o: any) => {
    distribucion[o.semaforo as Semaforo]++;
  });
  const totalObs = (obsRecientes ?? []).length;

  const animoProm =
    checkinsRecientes && checkinsRecientes.length
      ? checkinsRecientes.reduce((s: number, c: any) => s + c.animo, 0) /
        checkinsRecientes.length
      : null;
  const animoEmoji =
    animoProm != null
      ? ANIMO_OPCIONES[Math.min(4, Math.max(0, Math.round(animoProm) - 1))].emoji
      : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tablero</h1>
          <p className="text-sm text-slate-500">Resumen de las últimas 2 semanas</p>
        </div>
        <Link href="/ninos/nuevo" className="btn-primary">
          + Niño
        </Link>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metrica titulo="Niños activos" valor={totalNinos ?? 0} emoji="🧒" href="/ninos" />
        <Metrica
          titulo="Alertas abiertas"
          valor={alertasAbiertas ?? 0}
          emoji="🚨"
          href="/alertas"
          destacar={(alertasAbiertas ?? 0) > 0}
        />
        <Metrica
          titulo="Seguimientos pendientes"
          valor={seguimientosPendientes ?? 0}
          emoji="🤝"
          href="/seguimientos"
        />
        <Metrica titulo="Ánimo promedio" valor={animoEmoji} emoji="💗" href="/reportes" />
      </div>

      {/* Semáforo */}
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

      {/* Últimas observaciones */}
      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Últimas observaciones
        </h2>
        {!ultimasObs || ultimasObs.length === 0 ? (
          <p className="text-sm text-slate-500">Sin registros todavía.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {ultimasObs.map((o: any) => (
              <li key={o.id} className="py-3">
                <Link
                  href={`/ninos/${o.nino_id}`}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="font-medium text-slate-800">
                    {o.ninos?.nombre ?? 'Niño'}
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

function hace(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
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
