'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { calcularEdad, type Nino } from '@/lib/dominio';
import { Cargando } from '@/components/Cargando';

export default function PacientesPage() {
  const { db, cargado } = useStore();
  if (!cargado) return <Cargando />;

  const todos = [...db.ninos]
    .filter((n) => n.tipo === 'clinico')
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
  const activos = todos.filter((n) => n.activo);
  const archivados = todos.filter((n) => !n.activo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">👤 Pacientes</h1>
          <p className="text-sm text-slate-500">
            {activos.length} expediente{activos.length !== 1 ? 's' : ''} activo
            {activos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/pacientes/nuevo" className="btn-primary">
          + Nuevo paciente
        </Link>
      </div>

      {todos.length === 0 ? (
        <div className="card space-y-3 text-center text-sm text-slate-500">
          <p className="text-4xl">🧠</p>
          <p>Todavía no hay expedientes clínicos.</p>
          <p className="text-xs text-slate-400">
            Aquí puedes llevar el seguimiento de las personas que acompañes en
            tu práctica psicológica en formación.
          </p>
          <Link href="/pacientes/nuevo" className="btn-primary inline-block">
            Crear primer expediente
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activos.map((n) => (
            <TarjetaPaciente key={n.id} paciente={n} />
          ))}
        </div>
      )}

      {archivados.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">
            Archivados
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {archivados.map((n) => (
              <TarjetaPaciente key={n.id} paciente={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TarjetaPaciente({ paciente }: { paciente: Nino }) {
  const edad = calcularEdad(paciente.fecha_nacimiento);
  return (
    <Link
      href={`/pacientes/${paciente.id}`}
      className={`card flex items-center gap-3 transition hover:shadow-md ${
        !paciente.activo ? 'opacity-60' : ''
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl">
        👤
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-800">{paciente.nombre}</p>
        <p className="truncate text-xs text-slate-500">
          {edad != null ? `${edad} años` : ''}
          {edad != null && paciente.ocupacion ? ' · ' : ''}
          {paciente.ocupacion ?? ''}
          {!edad && !paciente.ocupacion ? 'Sin datos adicionales' : ''}
        </p>
        {paciente.motivo_consulta && (
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {paciente.motivo_consulta}
          </p>
        )}
      </div>
    </Link>
  );
}
