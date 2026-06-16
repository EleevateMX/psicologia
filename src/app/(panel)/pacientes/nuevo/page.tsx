'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PacienteForm } from '@/components/PacienteForm';
import { useStore } from '@/lib/store';
import { txtOrNull } from '@/lib/form';

export default function NuevoPacientePage() {
  const router = useRouter();
  const { agregarNino } = useStore();

  function crear(form: FormData) {
    const nuevo = agregarNino({
      tipo: 'clinico',
      nombre: (form.get('nombre') as string) || '',
      fecha_nacimiento: txtOrNull(form, 'fecha_nacimiento'),
      ocupacion: txtOrNull(form, 'ocupacion'),
      telefono: txtOrNull(form, 'telefono'),
      correo: txtOrNull(form, 'correo'),
      motivo_consulta: txtOrNull(form, 'motivo_consulta'),
      antecedentes: txtOrNull(form, 'antecedentes'),
      plan_trabajo: txtOrNull(form, 'plan_trabajo'),
      notas: txtOrNull(form, 'notas'),
      activo: form.get('activo') !== null,
      // Not used for clinical patients
      grupo: null,
      tutor_nombre: null,
      tutor_contacto: null,
      alergias: null,
    });
    router.push(`/pacientes/${nuevo.id}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/pacientes" className="text-sm text-brand-600 hover:underline">
          ← Pacientes
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">
          Nuevo expediente clínico
        </h1>
        <p className="text-sm text-slate-500">
          Los datos se guardan solo en este dispositivo.
        </p>
      </div>
      <div className="card">
        <PacienteForm action={crear} />
      </div>
    </div>
  );
}
