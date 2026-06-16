'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { calcularEdad, type Semaforo } from '@/lib/dominio';
import { BotonReporteGeneral } from '@/components/reportes/BotonesReporte';
import { AvisoConfidencialidad } from '@/components/AvisoConfidencialidad';
import type { FilaGeneral } from '@/lib/pdf';

export default function ReportesPage() {
  const { db, cargado } = useStore();
  if (!cargado) return <Cargando />;

  const ninos = [...db.ninos].sort((a, b) => a.nombre.localeCompare(b.nombre));

  const filas: FilaGeneral[] = ninos.map((nino) => {
    const misObs = db.observaciones.filter((o) => o.nino_id === nino.id);
    const dist: Record<Semaforo, number> = { verde: 0, amarillo: 0, rojo: 0 };
    misObs.forEach((o) => dist[o.semaforo]++);

    const misCheck = db.checkins.filter((c) => c.nino_id === nino.id);
    let animo = '—';
    if (misCheck.length) {
      const p = misCheck.reduce((s, c) => s + c.animo, 0) / misCheck.length;
      animo = `${p.toFixed(1)} / 5`;
    }

    const alertasAbiertas = db.alertas.filter(
      (a) => a.nino_id === nino.id && a.estado !== 'cerrada',
    ).length;

    return { nino, totalObs: misObs.length, dist, animo, alertasAbiertas };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">📄 Reportes</h1>
        <p className="text-sm text-slate-500">
          Exporta a PDF, firmado y con aviso de confidencialidad.
        </p>
      </div>

      <section className="card space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <div>
            <h2 className="font-semibold text-slate-800">Reporte general</h2>
            <p className="text-sm text-slate-500">
              Resumen de todo el safari en un PDF.
            </p>
          </div>
        </div>
        {filas.length === 0 ? (
          <p className="text-sm text-slate-500">
            Agrega fichas para generar reportes.
          </p>
        ) : (
          <BotonReporteGeneral filas={filas} />
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">
          Reportes individuales
        </h2>
        {filas.length === 0 ? (
          <p className="text-sm text-slate-500">Sin fichas registradas.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {filas.map((f) => {
              const edad = calcularEdad(f.nino.fecha_nacimiento);
              return (
                <Link
                  key={f.nino.id}
                  href={`/reportes/${f.nino.id}`}
                  className="card flex items-center justify-between transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{f.nino.animal}</span>
                    <div>
                      <p className="font-medium text-slate-800">{f.nino.nombre}</p>
                      <p className="text-xs text-slate-500">
                        {f.totalObs} obs. · {edad != null ? `${edad} años` : '—'}
                      </p>
                    </div>
                  </div>
                  <span className="text-brand-600">→</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <AvisoConfidencialidad />
    </div>
  );
}
