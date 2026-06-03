import Link from 'next/link';
import { getNinos } from '@/lib/datos';
import { calcularEdad } from '@/lib/dominio';

export const metadata = { title: 'Niños · Bitácora de Verano' };
export const dynamic = 'force-dynamic';

export default async function NinosPage() {
  const ninos = await getNinos();
  const activos = ninos.filter((n) => n.activo);
  const inactivos = ninos.filter((n) => !n.activo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Niñas y niños</h1>
          <p className="text-sm text-slate-500">{activos.length} en el curso</p>
        </div>
        <Link href="/ninos/nuevo" className="btn-primary">
          + Nuevo
        </Link>
      </div>

      {ninos.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">
          <p className="mb-3">Todavía no hay fichas registradas.</p>
          <Link href="/ninos/nuevo" className="btn-primary">
            Crear la primera ficha
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activos.map((n) => (
            <TarjetaNino key={n.id} nino={n} />
          ))}
        </div>
      )}

      {inactivos.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">
            Archivados
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inactivos.map((n) => (
              <TarjetaNino key={n.id} nino={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TarjetaNino({
  nino,
}: {
  nino: { id: string; nombre: string; grupo: string | null; fecha_nacimiento: string | null; activo: boolean };
}) {
  const edad = calcularEdad(nino.fecha_nacimiento);
  return (
    <Link
      href={`/ninos/${nino.id}`}
      className={`card flex items-center gap-3 transition hover:shadow-md ${
        !nino.activo ? 'opacity-60' : ''
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
        {nino.nombre.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-800">{nino.nombre}</p>
        <p className="text-xs text-slate-500">
          {edad != null ? `${edad} años` : 'Edad —'}
          {nino.grupo ? ` · ${nino.grupo}` : ''}
        </p>
      </div>
    </Link>
  );
}
