'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NinoForm } from '@/components/NinoForm';
import { BotonAccion } from '@/components/BotonAccion';
import { Cargando } from '@/components/Cargando';
import { useStore } from '@/lib/store';
import { txt, txtOrNull } from '@/lib/form';

export default function EditarNinoPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { db, cargado, actualizarNino, eliminarNino } = useStore();

  if (!cargado) return <Cargando />;
  const nino = db.ninos.find((n) => n.id === params.id);
  if (!nino) return <NoEncontrado />;

  function guardar(form: FormData) {
    actualizarNino(nino!.id, {
      nombre: txt(form, 'nombre'),
      animal: txt(form, 'animal') || nino!.animal,
      fecha_nacimiento: txtOrNull(form, 'fecha_nacimiento'),
      grupo: txtOrNull(form, 'grupo'),
      tutor_nombre: txtOrNull(form, 'tutor_nombre'),
      tutor_contacto: txtOrNull(form, 'tutor_contacto'),
      alergias: txtOrNull(form, 'alergias'),
      notas: txtOrNull(form, 'notas'),
      activo: form.get('activo') === 'on',
    });
    router.push(`/ninos/${nino!.id}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`/ninos/${nino.id}`}
          className="text-sm text-brand-600 hover:underline"
        >
          ← {nino.nombre}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">Editar ficha</h1>
      </div>

      <div className="card">
        <NinoForm action={guardar} nino={nino} esEdicion />
      </div>

      <div className="card border-red-200">
        <h2 className="text-sm font-semibold text-red-700">Zona delicada</h2>
        <p className="mt-1 text-sm text-slate-600">
          Eliminar la ficha borra también todas sus observaciones, check-ins,
          alertas y seguimientos. Si sólo terminó el curso, mejor archívala.
        </p>
        <div className="mt-3">
          <BotonAccion
            accion={() => {
              eliminarNino(nino.id);
              router.push('/ninos');
            }}
            confirmar="¿Eliminar esta ficha y todo su historial? Esta acción no se puede deshacer."
            className="btn-danger"
          >
            Eliminar ficha permanentemente
          </BotonAccion>
        </div>
      </div>
    </div>
  );
}

function NoEncontrado() {
  return (
    <div className="card text-center text-sm text-slate-500">
      No encontramos esta ficha.{' '}
      <Link href="/ninos" className="text-brand-600 hover:underline">
        Volver
      </Link>
    </div>
  );
}
