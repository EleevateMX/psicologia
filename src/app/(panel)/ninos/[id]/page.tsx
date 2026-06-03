import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getNino,
  getObservaciones,
  getCheckins,
  getAlertasDeNino,
  getSeguimientosDeNino,
} from '@/lib/datos';
import {
  crearObservacion,
  crearCheckin,
  crearAlerta,
  crearSeguimiento,
  cambiarEstadoAlerta,
  cambiarEstadoSeguimiento,
  eliminarObservacion,
} from '@/lib/acciones';
import {
  calcularEdad,
  formatearFecha,
  formatearFechaHora,
  MEDIO_CONTACTO_META,
} from '@/lib/dominio';
import {
  SemaforoBadge,
  CategoriaBadge,
  EstadoAlertaBadge,
  AnimoChip,
} from '@/components/Etiquetas';
import { ObservacionForm } from '@/components/forms/ObservacionForm';
import { CheckinForm } from '@/components/forms/CheckinForm';
import { AlertaForm } from '@/components/forms/AlertaForm';
import { SeguimientoForm } from '@/components/forms/SeguimientoForm';
import { BotonAccion } from '@/components/BotonAccion';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const nino = await getNino(params.id);
  return { title: `${nino?.nombre ?? 'Ficha'} · Bitácora de Verano` };
}

export default async function NinoDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const nino = await getNino(params.id);
  if (!nino) notFound();

  const [observaciones, checkins, alertas, seguimientos] = await Promise.all([
    getObservaciones(nino.id),
    getCheckins(nino.id),
    getAlertasDeNino(nino.id),
    getSeguimientosDeNino(nino.id),
  ]);

  const edad = calcularEdad(nino.fecha_nacimiento);
  const alertasAbiertas = alertas.filter((a) => a.estado !== 'cerrada');

  return (
    <div className="space-y-6">
      <Link href="/ninos" className="text-sm text-brand-600 hover:underline">
        ← Niños
      </Link>

      {/* Encabezado de ficha */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl font-semibold text-brand-700">
              {nino.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{nino.nombre}</h1>
              <p className="text-sm text-slate-500">
                {edad != null ? `${edad} años` : 'Edad —'}
                {nino.grupo ? ` · ${nino.grupo}` : ''}
                {!nino.activo && ' · Archivado'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/reportes/${nino.id}`}
              className="btn-secondary text-sm"
            >
              📄 Reporte
            </Link>
            <Link
              href={`/ninos/${nino.id}/editar`}
              className="btn-secondary text-sm"
            >
              Editar
            </Link>
          </div>
        </div>

        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Dato etiqueta="Tutora / tutor" valor={nino.tutor_nombre} />
          <Dato etiqueta="Contacto" valor={nino.tutor_contacto} />
          <Dato etiqueta="Alergias / salud" valor={nino.alergias} />
          <Dato etiqueta="Notas" valor={nino.notas} />
        </dl>

        {alertasAbiertas.length > 0 && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            🚨 {alertasAbiertas.length} alerta(s) abiertas requieren seguimiento.
          </div>
        )}
      </div>

      {/* Check-in de ánimo */}
      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          💗 Check-in de ánimo
        </h2>
        <CheckinForm action={crearCheckin.bind(null, nino.id)} />
        {checkins.length > 0 && (
          <ul className="mt-4 space-y-2">
            {checkins.slice(0, 8).map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <AnimoChip valor={c.animo} />
                <span className="text-xs text-slate-400">
                  {formatearFecha(c.fecha)}
                </span>
                {c.nota && <span className="truncate">— {c.nota}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Observaciones */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            🗒️ Observaciones ({observaciones.length})
          </h2>
        </div>
        <ObservacionForm action={crearObservacion.bind(null, nino.id)} />

        {observaciones.length === 0 ? (
          <p className="text-sm text-slate-500">Sin observaciones todavía.</p>
        ) : (
          <ul className="space-y-3">
            {observaciones.map((o) => (
              <li key={o.id} className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoriaBadge valor={o.categoria} />
                  <SemaforoBadge valor={o.semaforo} />
                  <span className="ml-auto text-xs text-slate-400">
                    {formatearFecha(o.fecha)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {o.descripcion}
                </p>
                {o.acciones && (
                  <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <span className="font-medium">Acompañamiento: </span>
                    {o.acciones}
                  </p>
                )}
                <div className="mt-2 text-right">
                  <BotonAccion
                    accion={eliminarObservacion.bind(null, o.id, nino.id)}
                    confirmar="¿Eliminar esta observación?"
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    Eliminar
                  </BotonAccion>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Alertas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            🚨 Alertas ({alertas.length})
          </h2>
          <AlertaForm action={crearAlerta.bind(null, nino.id)} />
        </div>
        {alertas.length === 0 ? (
          <p className="text-sm text-slate-500">Sin alertas.</p>
        ) : (
          <ul className="space-y-2">
            {alertas.map((a) => (
              <li key={a.id} className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <EstadoAlertaBadge valor={a.estado} />
                  <span className="font-medium text-slate-800">{a.titulo}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {formatearFechaHora(a.created_at)}
                  </span>
                </div>
                {a.detalle && (
                  <p className="mt-1 text-sm text-slate-600">{a.detalle}</p>
                )}
                <div className="mt-2 flex gap-2">
                  {a.estado !== 'en_seguimiento' && a.estado !== 'cerrada' && (
                    <BotonAccion
                      accion={cambiarEstadoAlerta.bind(null, a.id, 'en_seguimiento')}
                    >
                      Marcar en seguimiento
                    </BotonAccion>
                  )}
                  {a.estado !== 'cerrada' && (
                    <BotonAccion
                      accion={cambiarEstadoAlerta.bind(null, a.id, 'cerrada')}
                      className="btn-primary text-xs"
                    >
                      Cerrar
                    </BotonAccion>
                  )}
                  {a.estado === 'cerrada' && (
                    <BotonAccion
                      accion={cambiarEstadoAlerta.bind(null, a.id, 'abierta')}
                    >
                      Reabrir
                    </BotonAccion>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Seguimiento con tutores */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            🤝 Seguimiento con tutores ({seguimientos.length})
          </h2>
          <SeguimientoForm action={crearSeguimiento.bind(null, nino.id)} />
        </div>
        {seguimientos.length === 0 ? (
          <p className="text-sm text-slate-500">Sin seguimientos registrados.</p>
        ) : (
          <ul className="space-y-2">
            {seguimientos.map((s) => (
              <li key={s.id} className="card">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="badge border-slate-200 bg-slate-50 text-slate-600">
                    {MEDIO_CONTACTO_META[s.medio]}
                  </span>
                  <span
                    className={`badge border-transparent ${
                      s.estado === 'realizado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {s.estado === 'realizado' ? 'Realizado' : 'Pendiente'}
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
                {s.estado === 'pendiente' && (
                  <div className="mt-2">
                    <BotonAccion
                      accion={cambiarEstadoSeguimiento.bind(null, s.id, 'realizado')}
                      className="btn-primary text-xs"
                    >
                      Marcar realizado
                    </BotonAccion>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {etiqueta}
      </dt>
      <dd className="text-slate-700">{valor || '—'}</dd>
    </div>
  );
}
