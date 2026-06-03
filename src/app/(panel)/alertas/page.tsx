import Link from 'next/link';
import { getAlertas } from '@/lib/datos';
import { cambiarEstadoAlerta } from '@/lib/acciones';
import { formatearFechaHora } from '@/lib/dominio';
import { EstadoAlertaBadge } from '@/components/Etiquetas';
import { BotonAccion } from '@/components/BotonAccion';

export const metadata = { title: 'Alertas · Bitácora de Verano' };
export const dynamic = 'force-dynamic';

export default async function AlertasPage() {
  const alertas = await getAlertas();
  const abiertas = alertas.filter((a) => a.estado !== 'cerrada');
  const cerradas = alertas.filter((a) => a.estado === 'cerrada');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Alertas</h1>
        <p className="text-sm text-slate-500">
          {abiertas.length} pendientes de cerrar
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Activas</h2>
        {abiertas.length === 0 ? (
          <div className="card text-sm text-slate-500">
            ✅ No hay alertas activas. ¡Buen trabajo!
          </div>
        ) : (
          abiertas.map((a) => (
            <div key={a.id} className="card">
              <div className="flex flex-wrap items-center gap-2">
                <EstadoAlertaBadge valor={a.estado} />
                <Link
                  href={`/ninos/${a.nino_id}`}
                  className="font-medium text-brand-700 hover:underline"
                >
                  {a.nino_nombre}
                </Link>
                <span className="text-slate-700">· {a.titulo}</span>
                <span className="ml-auto text-xs text-slate-400">
                  {formatearFechaHora(a.created_at)}
                </span>
              </div>
              {a.detalle && (
                <p className="mt-1 text-sm text-slate-600">{a.detalle}</p>
              )}
              <div className="mt-2 flex gap-2">
                {a.estado !== 'en_seguimiento' && (
                  <BotonAccion
                    accion={cambiarEstadoAlerta.bind(null, a.id, 'en_seguimiento')}
                  >
                    En seguimiento
                  </BotonAccion>
                )}
                <BotonAccion
                  accion={cambiarEstadoAlerta.bind(null, a.id, 'cerrada')}
                  className="btn-primary text-xs"
                >
                  Cerrar
                </BotonAccion>
              </div>
            </div>
          ))
        )}
      </section>

      {cerradas.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-500">Cerradas</h2>
          {cerradas.map((a) => (
            <div key={a.id} className="card opacity-70">
              <div className="flex flex-wrap items-center gap-2">
                <EstadoAlertaBadge valor={a.estado} />
                <Link
                  href={`/ninos/${a.nino_id}`}
                  className="font-medium text-slate-600 hover:underline"
                >
                  {a.nino_nombre}
                </Link>
                <span className="text-slate-600">· {a.titulo}</span>
                <BotonAccion
                  accion={cambiarEstadoAlerta.bind(null, a.id, 'abierta')}
                  className="ml-auto text-xs text-slate-400 hover:text-brand-600"
                >
                  Reabrir
                </BotonAccion>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
