'use client';

import Link from 'next/link';
import {
  useStore,
  obsDeNino,
  checkinsDeNino,
  alertasDeNino,
  seguimientosDeNino,
  evaluacionesDeNino,
} from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import {
  SEMAFORO_META,
  ANIMO_OPCIONES,
  calcularEdad,
  type Semaforo,
} from '@/lib/dominio';
import { BotonReporteIndividual } from '@/components/reportes/BotonesReporte';
import { AvisoConfidencialidad } from '@/components/AvisoConfidencialidad';
import { FIRMANTE } from '@/lib/config';

export default function ReporteIndividualPage({
  params,
}: {
  params: { id: string };
}) {
  const { db, cargado } = useStore();
  if (!cargado) return <Cargando />;

  const nino = db.ninos.find((n) => n.id === params.id);
  if (!nino) {
    return (
      <div className="card text-center text-sm text-slate-500">
        No encontramos esta ficha.{' '}
        <Link href="/reportes" className="text-brand-600 hover:underline">
          Volver
        </Link>
      </div>
    );
  }

  const observaciones = obsDeNino(db, nino.id);
  const checkins = checkinsDeNino(db, nino.id);
  const alertas = alertasDeNino(db, nino.id);
  const seguimientos = seguimientosDeNino(db, nino.id);
  const evaluaciones = evaluacionesDeNino(db, nino.id);

  const dist: Record<Semaforo, number> = { verde: 0, amarillo: 0, rojo: 0 };
  observaciones.forEach((o) => dist[o.semaforo]++);
  const edad = calcularEdad(nino.fecha_nacimiento);
  const animoProm = checkins.length
    ? checkins.reduce((s, c) => s + c.animo, 0) / checkins.length
    : null;

  const datos = { nino, observaciones, checkins, alertas, seguimientos, evaluaciones };

  return (
    <div className="space-y-6">
      <Link href="/reportes" className="text-sm text-brand-600 hover:underline">
        ← Reportes
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{nino.animal}</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{nino.nombre}</h1>
            <p className="text-sm text-slate-500">
              Vista previa del reporte individual
            </p>
          </div>
        </div>
        <BotonReporteIndividual datos={datos} />
      </div>

      <div className="card space-y-4">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Dato etiqueta="Edad" valor={edad != null ? `${edad} años` : '—'} />
          <Dato etiqueta="Manada" valor={nino.grupo || '—'} />
          <Dato etiqueta="Tutor(a)" valor={nino.tutor_nombre || '—'} />
          <Dato etiqueta="Contacto" valor={nino.tutor_contacto || '—'} />
        </dl>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Resumen titulo="Observaciones" valor={observaciones.length} />
          <Resumen
            titulo="Semáforo"
            valor={`${SEMAFORO_META.verde.emoji}${dist.verde} ${SEMAFORO_META.amarillo.emoji}${dist.amarillo} ${SEMAFORO_META.rojo.emoji}${dist.rojo}`}
          />
          <Resumen
            titulo="Ánimo prom."
            valor={
              animoProm != null
                ? `${ANIMO_OPCIONES[Math.min(4, Math.round(animoProm) - 1)].emoji} ${animoProm.toFixed(1)}`
                : '—'
            }
          />
          <Resumen
            titulo="Alertas abiertas"
            valor={alertas.filter((a) => a.estado !== 'cerrada').length}
          />
        </div>

        <p className="text-xs text-slate-500">
          El PDF incluye el detalle completo de observaciones, alertas y
          seguimientos, firmado por {FIRMANTE.nombre} ({FIRMANTE.titulo}).
        </p>
      </div>

      <AvisoConfidencialidad />
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {etiqueta}
      </dt>
      <dd className="text-slate-700">{valor}</dd>
    </div>
  );
}

function Resumen({ titulo, valor }: { titulo: string; valor: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <p className="text-sm font-semibold text-slate-800">{valor}</p>
      <p className="text-[11px] text-slate-500">{titulo}</p>
    </div>
  );
}
