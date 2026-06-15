'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NinoForm } from '@/components/NinoForm';
import { useStore } from '@/lib/store';
import { txt, txtOrNull } from '@/lib/form';

export default function NuevoNinoPage() {
  const router = useRouter();
  const { agregarNino } = useStore();

  function crear(form: FormData) {
    const nuevo = agregarNino({
      nombre: txt(form, 'nombre'),
      animal: txt(form, 'animal') || undefined,
      fecha_nacimiento: txtOrNull(form, 'fecha_nacimiento'),
      grupo: txtOrNull(form, 'grupo'),
      tutor_nombre: txtOrNull(form, 'tutor_nombre'),
      tutor_contacto: txtOrNull(form, 'tutor_contacto'),
      alergias: txtOrNull(form, 'alergias'),
      notas: txtOrNull(form, 'notas'),
    });
    router.push(`/ninos/${nuevo.id}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/ninos" className="text-sm text-brand-600 hover:underline">
          ← Cachorros
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">Nueva ficha</h1>
      </div>
      <div className="card">
        <NinoForm action={crear} />
      </div>
    </div>
  );
}
