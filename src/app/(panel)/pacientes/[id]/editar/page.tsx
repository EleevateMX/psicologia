'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PacienteForm } from '@/components/PacienteForm';
import { useStore } from '@/lib/store';
import { txtOrNull } from '@/lib/form';
import { Cargando } from '@/components/Cargando';

export default function EditarPacientePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { db, cargado, actualizarNino, eliminarNino } = useStore();

  if (!cargado) return <Cargando />;

  const paciente = db.ninos.find((n) => n.id === params.id && n.tipo === 'clinico');
  if (!paciente) {
    return (
      <div className="card text-center text-sm text-slate-500">
        No encontramos este expediente.{' '}
        <Link href="/pacientes" className="text-brand-600 hover:underline">
          Volver
        </Link>
      </div>
    );
  }

  function guardar(form: FormData) {
    actualizarNino(paciente!.id, {
      nombre: (form.get('nombre') as string) || paciente!.nombre,
      fecha_nacimiento: txtOrNull(form, 'fecha_nacimiento'),
      ocupacion: txtOrNull(form, 'ocupacion'),
      telefono: txtOrNull(form, 'telefono'),
      correo: txtOrNull(form, 'correo'),
      motivo_consulta: txtOrNull(form, 'motivo_consulta'),
      antecedentes: txtOrNull(form, 'antecedentes'),
      plan_trabajo: txtOrNull(form, 'plan_trabajo'),
      notas: txtOrNull(form, 'notas'),
      activo: form.get('activo') !== null,
    });
    router.push(`/pacientes/${paciente!.id}`);
  }

  function archivar() {
    if (!confirm('¿Archivar este expediente? El contenido se conserva.')) return;
    actualizarNino(paciente!.id, { activo: false });
    router.push('/pacientes');
  }

  function eliminar() {
    if (
      !confirm(
        `¿Eliminar el expediente de ${paciente!.nombre}? Esta acción no se puede deshacer y borrará todas sus notas, actividades y evaluaciones.`,
      )
    )
      return;
    eliminarNino(paciente!.id);
    router.push('/pacientes');
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`/pacientes/${paciente.id}`}
          className="text-sm text-brand-600 hover:underline"
        >
          ← {paciente.nombre}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">
          Editar expediente
        </h1>
      </div>
      <div className="card">
        <PacienteForm action={guardar} inicial={paciente} />
      </div>
      <div className="card border-red-200 bg-red-50 space-y-3">
        <p className="text-sm font-semibold text-red-800">Zona de riesgo</p>
        <div className="flex gap-3">
          <button
            onClick={archivar}
            className="btn-secondary text-sm text-slate-600"
          >
            Archivar expediente
          </button>
          <button
            onClick={eliminar}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Eliminar permanentemente
          </button>
        </div>
      </div>
    </div>
  );
}
