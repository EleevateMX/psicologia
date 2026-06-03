import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NinoForm } from '@/components/NinoForm';
import { getNino } from '@/lib/datos';
import { actualizarNino, eliminarNino } from '@/lib/acciones';

export const metadata = { title: 'Editar ficha · Bitácora de Verano' };
export const dynamic = 'force-dynamic';

export default async function EditarNinoPage({
  params,
}: {
  params: { id: string };
}) {
  const nino = await getNino(params.id);
  if (!nino) notFound();

  const actualizar = actualizarNino.bind(null, nino.id);
  const eliminar = eliminarNino.bind(null, nino.id);

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
        <NinoForm action={actualizar} nino={nino} esEdicion />
      </div>

      <div className="card border-red-200">
        <h2 className="text-sm font-semibold text-red-700">Zona delicada</h2>
        <p className="mt-1 text-sm text-slate-600">
          Eliminar la ficha borra también todas sus observaciones, check-ins,
          alertas y seguimientos. Si sólo terminó el curso, mejor archívala.
        </p>
        <form action={eliminar} className="mt-3">
          <button type="submit" className="btn-danger">
            Eliminar ficha permanentemente
          </button>
        </form>
      </div>
    </div>
  );
}
