'use client';

import Link from 'next/link';
import {
  useStore,
  obsDeNino,
  checkinsDeNino,
  alertasDeNino,
  seguimientosDeNino,
  evaluacionesDeNino,
  notasDeNino,
  actividadesDeNino,
} from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { txt, txtOrNull } from '@/lib/form';
import {
  calcularEdad,
  formatearFecha,
  formatearFechaHora,
  interpretarConInstrumento,
  TIPO_NOTA_META,
  MEDIO_CONTACTO_META,
  type Categoria,
  type Semaforo,
  type MedioContacto,
  type EstadoSeguimiento,
  type TipoNota,
} from '@/lib/dominio';
import {
  SemaforoBadge,
  CategoriaBadge,
  EstadoAlertaBadge,
  AnimoChip,
} from '@/components/Etiquetas';
import { LineaAnimo, BarrasSemaforo } from '@/components/Graficas';
import { ObservacionForm } from '@/components/forms/ObservacionForm';
import { CheckinForm } from '@/components/forms/CheckinForm';
import { AlertaForm } from '@/components/forms/AlertaForm';
import { SeguimientoForm } from '@/components/forms/SeguimientoForm';
import { AplicarEvaluacion } from '@/components/forms/AplicarEvaluacion';
import { NotaForm } from '@/components/forms/NotaForm';
import { ActividadForm } from '@/components/forms/ActividadForm';
import { BotonAccion } from '@/components/BotonAccion';

export default function NinoDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const store = useStore();
  const { db, cargado } = store;

  if (!cargado) return <Cargando />;
  const nino = db.ninos.find((n) => n.id === params.id);
  if (!nino) {
    return (
      <div className="card text-center text-sm text-slate-500">
        No encontramos esta ficha.{' '}
        <Link href="/ninos" className="text-brand-600 hover:underline">
          Volver a cachorros
        </Link>
      </div>
    );
  }

  const observaciones = obsDeNino(db, nino.id);
  const checkins = checkinsDeNino(db, nino.id);
  const alertas = alertasDeNino(db, nino.id);
  const seguimientos = seguimientosDeNino(db, nino.id);
  const evaluaciones = evaluacionesDeNino(db, nino.id);
  const notas = notasDeNino(db, nino.id);
  const actividades = actividadesDeNino(db, nino.id);
  const edad = calcularEdad(nino.fecha_nacimiento);
  const alertasAbiertas = alertas.filter((a) => a.estado !== 'cerrada');

  // Datos para el bloque de análisis
  const puntosAnimo = [...checkins]
    .sort((a, b) => (a.fecha < b.fecha ? -1 : 1))
    .slice(-12)
    .map((c) => ({ fecha: c.fecha, animo: c.animo }));
  const distSemaforo: Record<Semaforo, number> = { verde: 0, amarillo: 0, rojo: 0 };
  observaciones.forEach((o) => distSemaforo[o.semaforo]++);

  // Handlers (escriben en el almacén local) ---------------------------------
  const crearObservacion = (form: FormData) =>
    store.agregarObservacion({
      nino_id: nino.id,
      fecha: txt(form, 'fecha'),
      categoria: txt(form, 'categoria') as Categoria,
      semaforo: txt(form, 'semaforo') as Semaforo,
      descripcion: txt(form, 'descripcion'),
      acciones: txtOrNull(form, 'acciones'),
      crearAlerta: form.get('crear_alerta') === 'on',
    });

  const crearCheckin = (form: FormData) =>
    store.agregarCheckin({
      nino_id: nino.id,
      fecha: txt(form, 'fecha'),
      animo: Number(form.get('animo')),
      nota: txtOrNull(form, 'nota'),
    });

  const crearAlerta = (form: FormData) =>
    store.agregarAlerta({
      nino_id: nino.id,
      observacion_id: null,
      titulo: txt(form, 'titulo'),
      detalle: txtOrNull(form, 'detalle'),
    });

  const crearSeguimiento = (form: FormData) =>
    store.agregarSeguimiento({
      nino_id: nino.id,
      fecha: txt(form, 'fecha'),
      medio: txt(form, 'medio') as MedioContacto,
      resumen: txt(form, 'resumen'),
      acuerdos: txtOrNull(form, 'acuerdos'),
      estado: (txt(form, 'estado') as EstadoSeguimiento) || 'pendiente',
    });

  const crearNota = (form: FormData) =>
    store.agregarNota({
      nino_id: nino.id,
      fecha: txt(form, 'fecha'),
      tipo: (txt(form, 'tipo') as TipoNota) || 'general',
      titulo: txtOrNull(form, 'titulo'),
      contenido: txt(form, 'contenido'),
    });

  const crearActividad = (form: FormData) =>
    store.agregarActividad({
      nino_id: nino.id,
      fecha: txt(form, 'fecha'),
      titulo: txt(form, 'titulo'),
      descripcion: txtOrNull(form, 'descripcion'),
      objetivo: txtOrNull(form, 'objetivo'),
      estado: (txt(form, 'estado') as 'planeada' | 'realizada') || 'planeada',
    });

  return (
    <div className="space-y-6">
      <Link href="/ninos" className="text-sm text-brand-600 hover:underline">
        ← Cachorros
      </Link>

      {/* Encabezado de ficha */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
              {nino.animal}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{nino.nombre}</h1>
              <p className="text-sm text-slate-500">
                {edad != null ? `${edad} años` : 'Edad —'}
                {nino.grupo ? ` · Manada ${nino.grupo}` : ''}
                {!nino.activo && ' · Archivado'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/reportes/${nino.id}`} className="btn-secondary text-sm">
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
            🦁 {alertasAbiertas.length} alerta(s) abiertas requieren seguimiento.
          </div>
        )}
      </div>

      {/* Análisis */}
      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          📈 Análisis del expediente
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Evolución del ánimo
            </p>
            <LineaAnimo puntos={puntosAnimo} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Semáforo de observaciones
            </p>
            <BarrasSemaforo dist={distSemaforo} />
          </div>
        </div>
      </section>

      {/* Notas */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          📝 Notas ({notas.length})
        </h2>
        <NotaForm action={crearNota} />
        {notas.length === 0 ? (
          <p className="text-sm text-slate-500">Sin notas todavía.</p>
        ) : (
          <ul className="space-y-2">
            {notas.map((n) => (
              <li key={n.id} className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge border-transparent ${TIPO_NOTA_META[n.tipo].clase}`}>
                    {TIPO_NOTA_META[n.tipo].emoji} {TIPO_NOTA_META[n.tipo].etiqueta}
                  </span>
                  {n.titulo && (
                    <span className="font-medium text-slate-800">{n.titulo}</span>
                  )}
                  <span className="ml-auto text-xs text-slate-400">
                    {formatearFecha(n.fecha)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {n.contenido}
                </p>
                <div className="mt-2 text-right">
                  <BotonAccion
                    accion={() => store.eliminarNota(n.id)}
                    confirmar="¿Eliminar esta nota?"
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

      {/* Actividades */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          🎒 Actividades ({actividades.length})
        </h2>
        <ActividadForm action={crearActividad} />
        {actividades.length === 0 ? (
          <p className="text-sm text-slate-500">Sin actividades todavía.</p>
        ) : (
          <ul className="space-y-2">
            {actividades.map((a) => (
              <li key={a.id} className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`badge border-transparent ${
                      a.estado === 'realizada'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {a.estado === 'realizada' ? '✓ Realizada' : '◷ Planeada'}
                  </span>
                  <span className="font-medium text-slate-800">{a.titulo}</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {formatearFecha(a.fecha)}
                  </span>
                </div>
                {a.descripcion && (
                  <p className="mt-1 text-sm text-slate-700">{a.descripcion}</p>
                )}
                {a.objetivo && (
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-medium">Objetivo: </span>
                    {a.objetivo}
                  </p>
                )}
                <div className="mt-2 flex justify-end gap-2">
                  {a.estado === 'planeada' && (
                    <BotonAccion
                      accion={() => store.cambiarEstadoActividad(a.id, 'realizada')}
                      className="btn-primary text-xs"
                    >
                      Marcar realizada
                    </BotonAccion>
                  )}
                  <BotonAccion
                    accion={() => store.eliminarActividad(a.id)}
                    confirmar="¿Eliminar esta actividad?"
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

      {/* Check-in de ánimo */}
      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          💗 Check-in de ánimo
        </h2>
        <CheckinForm action={crearCheckin} />
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
        <h2 className="text-sm font-semibold text-slate-700">
          🗒️ Observaciones ({observaciones.length})
        </h2>
        <ObservacionForm action={crearObservacion} />

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
                    accion={() => store.eliminarObservacion(o.id)}
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

      {/* Evaluaciones */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          📋 Evaluaciones ({evaluaciones.length})
        </h2>
        <AplicarEvaluacion ninoId={nino.id} />
        {evaluaciones.length === 0 ? (
          <p className="text-sm text-slate-500">
            Sin evaluaciones aplicadas todavía.
          </p>
        ) : (
          <ul className="space-y-2">
            {evaluaciones.map((ev) => {
              const inst = db.instrumentos.find((i) => i.id === ev.instrumento_id);
              const interp = interpretarConInstrumento(ev.puntaje, inst);
              return (
                <li key={ev.id} className="card">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-800">
                      {ev.instrumento_nombre}
                    </span>
                    {ev.puntaje != null && (
                      <span className={`badge border-transparent ${interp.clase}`}>
                        {ev.puntaje.toFixed(1)}/5 · {interp.etiqueta}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-slate-400">
                      {formatearFecha(ev.fecha)}
                    </span>
                  </div>
                  {inst && (
                    <ul className="mt-2 space-y-0.5 text-sm text-slate-600">
                      {inst.items.map((it) => {
                        const r = ev.respuestas[it.id];
                        if (r === undefined || r === '') return null;
                        return (
                          <li key={it.id}>
                            <span className="text-slate-500">{it.texto}:</span>{' '}
                            <span className="font-medium">{String(r)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {ev.notas && (
                    <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      {ev.notas}
                    </p>
                  )}
                  <div className="mt-2 text-right">
                    <BotonAccion
                      accion={() => store.eliminarEvaluacion(ev.id)}
                      confirmar="¿Eliminar esta evaluación?"
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      Eliminar
                    </BotonAccion>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Alertas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            🦁 Alertas ({alertas.length})
          </h2>
          <AlertaForm action={crearAlerta} />
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
                      accion={() => store.cambiarEstadoAlerta(a.id, 'en_seguimiento')}
                    >
                      Marcar en seguimiento
                    </BotonAccion>
                  )}
                  {a.estado !== 'cerrada' && (
                    <BotonAccion
                      accion={() => store.cambiarEstadoAlerta(a.id, 'cerrada')}
                      className="btn-primary text-xs"
                    >
                      Cerrar
                    </BotonAccion>
                  )}
                  {a.estado === 'cerrada' && (
                    <BotonAccion
                      accion={() => store.cambiarEstadoAlerta(a.id, 'abierta')}
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
          <SeguimientoForm action={crearSeguimiento} />
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
                      accion={() => store.cambiarEstadoSeguimiento(s.id, 'realizado')}
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
