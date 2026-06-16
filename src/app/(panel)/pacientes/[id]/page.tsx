'use client';

import Link from 'next/link';
import {
  useStore,
  notasDeNino,
  actividadesDeNino,
  evaluacionesDeNino,
  alertasDeNino,
  seguimientosDeNino,
  entrevistasDeNino,
} from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { txtOrNull } from '@/lib/form';
import {
  calcularEdad,
  formatearFecha,
  formatearFechaHora,
  interpretarConInstrumento,
  TIPO_NOTA_META,
  MEDIO_CONTACTO_META,
  AVISO_CLINICO,
  type MedioContacto,
  type EstadoSeguimiento,
  type TipoNota,
} from '@/lib/dominio';
import { EstadoAlertaBadge } from '@/components/Etiquetas';
import { NotaForm } from '@/components/forms/NotaForm';
import { ActividadForm } from '@/components/forms/ActividadForm';
import { AlertaForm } from '@/components/forms/AlertaForm';
import { SeguimientoForm } from '@/components/forms/SeguimientoForm';
import { AplicarEvaluacion } from '@/components/forms/AplicarEvaluacion';
import { AplicarEntrevista } from '@/components/forms/AplicarEntrevista';
import { BotonAccion } from '@/components/BotonAccion';

export default function PacienteDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const store = useStore();
  const { db, cargado } = store;

  if (!cargado) return <Cargando />;

  const paciente = db.ninos.find((n) => n.id === params.id && n.tipo === 'clinico');
  if (!paciente) {
    return (
      <div className="card text-center text-sm text-slate-500">
        No encontramos este expediente.{' '}
        <Link href="/pacientes" className="text-brand-600 hover:underline">
          Volver a Pacientes
        </Link>
      </div>
    );
  }

  const notas = notasDeNino(db, paciente.id);
  const actividades = actividadesDeNino(db, paciente.id);
  const evaluaciones = evaluacionesDeNino(db, paciente.id);
  const alertas = alertasDeNino(db, paciente.id);
  const seguimientos = seguimientosDeNino(db, paciente.id);
  const entrevistas = entrevistasDeNino(db, paciente.id);
  const edad = calcularEdad(paciente.fecha_nacimiento);
  const alertasAbiertas = alertas.filter((a) => a.estado !== 'cerrada');

  const crearNota = (form: FormData) =>
    store.agregarNota({
      nino_id: paciente.id,
      fecha: (form.get('fecha') as string) || new Date().toISOString().slice(0, 10),
      tipo: ((form.get('tipo') as TipoNota) || 'sesion'),
      titulo: txtOrNull(form, 'titulo'),
      contenido: (form.get('contenido') as string) || '',
    });

  const crearActividad = (form: FormData) =>
    store.agregarActividad({
      nino_id: paciente.id,
      fecha: (form.get('fecha') as string) || new Date().toISOString().slice(0, 10),
      titulo: (form.get('titulo') as string) || '',
      descripcion: txtOrNull(form, 'descripcion'),
      objetivo: txtOrNull(form, 'objetivo'),
      estado: ((form.get('estado') as string) || 'planeada') as 'planeada' | 'realizada',
    });

  const crearAlerta = (form: FormData) =>
    store.agregarAlerta({
      nino_id: paciente.id,
      observacion_id: null,
      titulo: (form.get('titulo') as string) || '',
      detalle: txtOrNull(form, 'detalle'),
    });

  const crearSeguimiento = (form: FormData) =>
    store.agregarSeguimiento({
      nino_id: paciente.id,
      fecha: (form.get('fecha') as string) || new Date().toISOString().slice(0, 10),
      medio: (form.get('medio') as MedioContacto) || 'presencial',
      resumen: (form.get('resumen') as string) || '',
      acuerdos: txtOrNull(form, 'acuerdos'),
      estado: ((form.get('estado') as EstadoSeguimiento) || 'pendiente'),
    });

  return (
    <div className="space-y-6">
      <Link href="/pacientes" className="text-sm text-brand-600 hover:underline">
        ← Pacientes
      </Link>

      {/* Encabezado */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{paciente.nombre}</h1>
              <p className="text-sm text-slate-500">
                {edad != null ? `${edad} años` : ''}
                {edad != null && paciente.ocupacion ? ' · ' : ''}
                {paciente.ocupacion ?? ''}
                {!paciente.activo && ' · Archivado'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/reportes/paciente/${paciente.id}`}
              className="btn-secondary text-sm"
            >
              📄 Reporte
            </Link>
            <Link
              href={`/pacientes/${paciente.id}/editar`}
              className="btn-secondary text-sm"
            >
              Editar
            </Link>
          </div>
        </div>

        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Dato etiqueta="Teléfono" valor={paciente.telefono} />
          <Dato etiqueta="Correo" valor={paciente.correo} />
        </dl>

        {alertasAbiertas.length > 0 && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            ⚠️ {alertasAbiertas.length} alerta(s) activa(s) requieren atención.
          </div>
        )}
      </div>

      {/* Información clínica */}
      <section className="card space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">
          🧠 Información clínica
        </h2>
        <CampoClinico etiqueta="Motivo de consulta" valor={paciente.motivo_consulta} />
        <CampoClinico etiqueta="Antecedentes" valor={paciente.antecedentes} />
        <CampoClinico etiqueta="Plan de trabajo / objetivos" valor={paciente.plan_trabajo} />
        {paciente.notas && (
          <CampoClinico etiqueta="Notas adicionales" valor={paciente.notas} />
        )}
        <p className="text-right">
          <Link
            href={`/pacientes/${paciente.id}/editar`}
            className="text-xs text-brand-600 hover:underline"
          >
            Actualizar información clínica →
          </Link>
        </p>
      </section>

      {/* Entrevistas / anamnesis */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          🗒️ Entrevistas ({entrevistas.length})
        </h2>
        <AplicarEntrevista ninoId={paciente.id} />
        {entrevistas.length === 0 ? (
          <p className="text-sm text-slate-500">
            Sin entrevistas registradas. Aplica una{' '}
            <Link href="/guias" className="text-brand-600 hover:underline">
              guía de entrevista
            </Link>{' '}
            para iniciar la anamnesis.
          </p>
        ) : (
          <ul className="space-y-2">
            {entrevistas.map((ent) => {
              const guia = db.guias.find((g) => g.id === ent.guia_id);
              return (
                <li key={ent.id} className="card">
                  <details>
                    <summary className="flex cursor-pointer flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-800">
                        {ent.guia_nombre}
                      </span>
                      <span className="ml-auto text-xs text-slate-400">
                        {formatearFecha(ent.fecha)}
                      </span>
                    </summary>
                    <div className="mt-3 space-y-3">
                      {guia ? (
                        guia.secciones.map((s) => {
                          const conResp = s.preguntas.filter(
                            (p) => (ent.respuestas[p.id] ?? '').trim() !== '',
                          );
                          if (conResp.length === 0) return null;
                          return (
                            <div key={s.id}>
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                                {s.titulo}
                              </p>
                              <dl className="mt-1 space-y-1.5">
                                {conResp.map((p) => (
                                  <div key={p.id}>
                                    <dt className="text-sm text-slate-500">
                                      {p.texto}
                                    </dt>
                                    <dd className="whitespace-pre-wrap text-sm text-slate-700">
                                      {ent.respuestas[p.id]}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs italic text-slate-400">
                          La guía original fue eliminada; se conservan las
                          respuestas registradas.
                        </p>
                      )}
                      {ent.notas && (
                        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                          <span className="font-medium">Notas: </span>
                          {ent.notas}
                        </p>
                      )}
                    </div>
                  </details>
                  <div className="mt-2 text-right">
                    <BotonAccion
                      accion={() => store.eliminarEntrevista(ent.id)}
                      confirmar="¿Eliminar esta entrevista?"
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

      {/* Notas de sesión */}
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
                  <span
                    className={`badge border-transparent ${TIPO_NOTA_META[n.tipo].clase}`}
                  >
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
          🎯 Actividades terapéuticas ({actividades.length})
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

      {/* Evaluaciones */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">
          📋 Evaluaciones ({evaluaciones.length})
        </h2>
        <AplicarEvaluacion ninoId={paciente.id} />
        {evaluaciones.length === 0 ? (
          <p className="text-sm text-slate-500">Sin evaluaciones aplicadas todavía.</p>
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

      {/* Alertas / situaciones de atención */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            ⚠️ Alertas / Situaciones de atención ({alertas.length})
          </h2>
          <AlertaForm action={crearAlerta} />
        </div>
        {alertas.length === 0 ? (
          <p className="text-sm text-slate-500">Sin alertas registradas.</p>
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
                      En seguimiento
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

      {/* Seguimiento / red de apoyo */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            🤝 Seguimiento / Red de apoyo ({seguimientos.length})
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

      {/* Aviso de confidencialidad clínica */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[11px] leading-relaxed text-indigo-800">
        <span className="font-semibold">🔒 </span>
        {AVISO_CLINICO}
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null | undefined }) {
  if (!valor) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {etiqueta}
      </dt>
      <dd className="text-slate-700">{valor}</dd>
    </div>
  );
}

function CampoClinico({
  etiqueta,
  valor,
}: {
  etiqueta: string;
  valor: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {etiqueta}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
        {valor || <span className="italic text-slate-400">Sin registrar</span>}
      </p>
    </div>
  );
}
