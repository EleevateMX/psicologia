'use client';

import Link from 'next/link';
import {
  useStore,
  notasDeNino,
  actividadesDeNino,
  evaluacionesDeNino,
  alertasDeNino,
  seguimientosDeNino,
} from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { calcularEdad, AVISO_CLINICO } from '@/lib/dominio';
import { BotonReportePaciente } from '@/components/reportes/BotonesReporte';
import { FIRMANTE } from '@/lib/config';

export default function ReportePacientePage({
  params,
}: {
  params: { id: string };
}) {
  const { db, cargado } = useStore();
  if (!cargado) return <Cargando />;

  const paciente = db.ninos.find((n) => n.id === params.id && n.tipo === 'clinico');
  if (!paciente) {
    return (
      <div className="card text-center text-sm text-slate-500">
        No encontramos este expediente.{' '}
        <Link href="/reportes" className="text-brand-600 hover:underline">
          Volver
        </Link>
      </div>
    );
  }

  const notas = notasDeNino(db, paciente.id);
  const actividades = actividadesDeNino(db, paciente.id);
  const evaluaciones = evaluacionesDeNino(db, paciente.id);
  const alertas = alertasDeNino(db, paciente.id);
  const seguimientos = seguimientosDeNino(db, paciente.id);
  const edad = calcularEdad(paciente.fecha_nacimiento);

  const datos = { paciente, notas, actividades, evaluaciones, alertas, seguimientos };

  return (
    <div className="space-y-6">
      <Link href="/reportes" className="text-sm text-brand-600 hover:underline">
        ← Reportes
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👤</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{paciente.nombre}</h1>
            <p className="text-sm text-slate-500">Vista previa · Reporte clínico</p>
          </div>
        </div>
        <BotonReportePaciente datos={datos} />
      </div>

      <div className="card space-y-4">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {edad != null && <Dato etiqueta="Edad" valor={`${edad} años`} />}
          {paciente.ocupacion && <Dato etiqueta="Ocupación" valor={paciente.ocupacion} />}
          {paciente.telefono && <Dato etiqueta="Teléfono" valor={paciente.telefono} />}
          {paciente.correo && <Dato etiqueta="Correo" valor={paciente.correo} />}
        </dl>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Resumen titulo="Notas" valor={notas.length} />
          <Resumen
            titulo="Actividades"
            valor={`${actividades.filter((a) => a.estado === 'realizada').length}/${actividades.length}`}
          />
          <Resumen titulo="Evaluaciones" valor={evaluaciones.length} />
          <Resumen
            titulo="Alertas abiertas"
            valor={alertas.filter((a) => a.estado !== 'cerrada').length}
          />
        </div>

        <p className="text-xs text-slate-500">
          El PDF incluye el detalle completo del expediente, firmado por{' '}
          {FIRMANTE.nombre} ({FIRMANTE.titulo}).
        </p>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[11px] leading-relaxed text-indigo-800">
        <span className="font-semibold">🔒 </span>
        {AVISO_CLINICO}
      </div>
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
