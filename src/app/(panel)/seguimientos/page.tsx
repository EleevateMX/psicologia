import Link from 'next/link';
import { getSeguimientos } from '@/lib/datos';
import { cambiarEstadoSeguimiento } from '@/lib/acciones';
import { formatearFecha, MEDIO_CONTACTO_META } from '@/lib/dominio';
import { BotonAccion } from '@/components/BotonAccion';

export const metadata = { title: 'Seguimiento con tutores · Bitácora de Verano' };
export const dynamic = 'force-dynamic';

export default async function SeguimientosPage() {
  const seguimientos = await getSeguimientos();
  const pendientes = seguimientos.filter((s) => s.estado === 'pendiente');
  const realizados = seguimientos.filter((s) => s.estado === 'realizado');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Seguimiento con tutores
        </h1>
        <p className="text-sm text-slate-500">
          {pendientes.length} pendientes
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Pendientes</h2>
        {pendientes.length === 0 ? (
          <div className="card text-sm text-slate-500">
            No hay seguimientos pendientes.
          </div>
        ) : (
          pendientes.map((s) => (
            <Fila key={s.id} s={s} />
          ))
        )}
      </section>

      {realizados.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-500">Realizados</h2>
          {realizados.map((s) => (
            <Fila key={s.id} s={s} realizado />
          ))}
        </section>
      )}
    </div>
  );
}

function Fila({
  s,
  realizado,
}: {
  s: {
    id: string;
    nino_id: string;
    nino_nombre: string;
    fecha: string;
    medio: keyof typeof MEDIO_CONTACTO_META;
    resumen: string;
    acuerdos: string | null;
  };
  realizado?: boolean;
}) {
  return (
    <div className={`card ${realizado ? 'opacity-75' : ''}`}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href={`/ninos/${s.nino_id}`}
          className="font-medium text-brand-700 hover:underline"
        >
          {s.nino_nombre}
        </Link>
        <span className="badge border-slate-200 bg-slate-50 text-slate-600">
          {MEDIO_CONTACTO_META[s.medio]}
        </span>
        <span className="ml-auto text-xs text-slate-400">
          {formatearFecha(s.fecha)}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-700">{s.resumen}</p>
      {s.acuerdos && (
        <p className="mt-1 text-sm text-slate-600">
          <span className="font-medium">Acuerdos: </span>
          {s.acuerdos}
        </p>
      )}
      {!realizado && (
        <div className="mt-2">
          <BotonAccion
            accion={cambiarEstadoSeguimiento.bind(null, s.id, 'realizado')}
            className="btn-primary text-xs"
          >
            Marcar realizado
          </BotonAccion>
        </div>
      )}
    </div>
  );
}
