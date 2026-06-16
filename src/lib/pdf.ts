'use client';

import type { jsPDF } from 'jspdf';
import {
  AVISO_CONFIDENCIALIDAD,
  AVISO_CLINICO,
  SEMAFORO_META,
  CATEGORIA_META,
  ANIMO_OPCIONES,
  MEDIO_CONTACTO_META,
  ESTADO_ALERTA_META,
  calcularEdad,
  formatearFecha,
  type Semaforo,
} from '@/lib/dominio';
import { FIRMANTE } from '@/lib/config';
import type {
  Nino,
  Observacion,
  CheckinAnimo,
  Alerta,
  Seguimiento,
  Evaluacion,
  Nota,
  Actividad,
  GuiaEntrevista,
  Entrevista,
} from '@/lib/dominio';
import { interpretarPuntaje, interpretarConInstrumento, TIPO_NOTA_META } from '@/lib/dominio';

const MARGEN = 14;
const VERDE: [number, number, number] = [79, 119, 40]; // verde selva

/**
 * Carga jsPDF y su plugin de tablas de forma diferida (code-splitting): la
 * librería (~140 KB) solo se descarga cuando se genera un PDF, no en la carga
 * inicial de la página de reportes.
 */
async function cargarPdf() {
  const [jspdf, autotable] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  return { JsPDF: jspdf.jsPDF, autoTable: autotable.default };
}

function encabezado(doc: jsPDF, titulo: string, subtitulo?: string) {
  doc.setFillColor(...VERDE);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('Psico-Note · Curso de Verano', MARGEN, 11);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(titulo, MARGEN, 18);
  if (subtitulo) {
    doc.setFontSize(8);
    doc.text(
      subtitulo,
      doc.internal.pageSize.getWidth() - MARGEN,
      18,
      { align: 'right' },
    );
  }
  doc.setTextColor(0, 0, 0);
}

/** Pie de cada página: firma del profesional + confidencialidad + paginación. */
function pieEnCadaPagina(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(220);
    doc.line(MARGEN, h - 18, w - MARGEN, h - 18);
    doc.setFontSize(7);
    doc.setTextColor(110);
    const aviso = doc.splitTextToSize(AVISO_CONFIDENCIALIDAD, w - MARGEN * 2);
    doc.text(aviso, MARGEN, h - 14);
    doc.setTextColor(60);
    doc.setFont('helvetica', 'bold');
    doc.text(`${FIRMANTE.nombre}`, MARGEN, h - 5);
    doc.setFont('helvetica', 'normal');
    doc.text(FIRMANTE.titulo, MARGEN, h - 2);
    doc.text(`Página ${i} de ${total}`, w - MARGEN, h - 2, { align: 'right' });
    doc.setTextColor(0);
  }
}

function fechaEmision(): string {
  return new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function distribucionSemaforo(obs: Observacion[]): Record<Semaforo, number> {
  const d: Record<Semaforo, number> = { verde: 0, amarillo: 0, rojo: 0 };
  obs.forEach((o) => d[o.semaforo]++);
  return d;
}

function animoPromedio(checkins: CheckinAnimo[]): string {
  if (!checkins.length) return '—';
  const p = checkins.reduce((s, c) => s + c.animo, 0) / checkins.length;
  const op = ANIMO_OPCIONES[Math.min(4, Math.max(0, Math.round(p) - 1))];
  return `${op.etiqueta} (${p.toFixed(1)}/5)`;
}

// ---------------------------------------------------------------------------
// Reporte individual
// ---------------------------------------------------------------------------

export interface DatosReporteIndividual {
  nino: Nino;
  observaciones: Observacion[];
  checkins: CheckinAnimo[];
  alertas: Alerta[];
  seguimientos: Seguimiento[];
  evaluaciones: Evaluacion[];
  notas: Nota[];
  actividades: Actividad[];
}

export async function generarReporteIndividual(d: DatosReporteIndividual) {
  const { JsPDF, autoTable } = await cargarPdf();
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  const edad = calcularEdad(d.nino.fecha_nacimiento);
  encabezado(doc, 'Reporte individual', `Emitido: ${fechaEmision()}`);

  let y = 32;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(d.nino.nombre, MARGEN, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90);
  doc.text(
    [
      edad != null ? `Edad: ${edad} años` : 'Edad: —',
      `Grupo: ${d.nino.grupo || '—'}`,
      `Tutor(a): ${d.nino.tutor_nombre || '—'}`,
      `Contacto: ${d.nino.tutor_contacto || '—'}`,
    ].join('    '),
    MARGEN,
    y,
  );
  doc.setTextColor(0);
  y += 4;

  // Resumen
  const dist = distribucionSemaforo(d.observaciones);
  autoTable(doc, {
    startY: y + 2,
    head: [['Resumen del periodo', '']],
    body: [
      ['Observaciones registradas', String(d.observaciones.length)],
      [
        'Semáforo',
        `Verde ${dist.verde}   ·   Amarillo ${dist.amarillo}   ·   Rojo ${dist.rojo}`,
      ],
      ['Ánimo promedio', animoPromedio(d.checkins)],
      [
        'Alertas abiertas',
        String(d.alertas.filter((a) => a.estado !== 'cerrada').length),
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: VERDE },
    styles: { fontSize: 9 },
    margin: { left: MARGEN, right: MARGEN },
  });

  // Observaciones
  if (d.observaciones.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Categoría', 'Semáforo', 'Observación', 'Acompañamiento']],
      body: d.observaciones.map((o) => [
        formatearFecha(o.fecha),
        CATEGORIA_META[o.categoria].etiqueta,
        SEMAFORO_META[o.semaforo].etiqueta,
        o.descripcion,
        o.acciones || '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, cellPadding: 1.5, valign: 'top' },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 22 },
        2: { cellWidth: 16 },
        3: { cellWidth: 60 },
      },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Alertas
  if (d.alertas.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Alertas', 'Estado', 'Detalle']],
      body: d.alertas.map((a) => [
        a.titulo,
        ESTADO_ALERTA_META[a.estado].etiqueta,
        a.detalle || '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Seguimientos con tutores
  if (d.seguimientos.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Medio', 'Resumen', 'Acuerdos']],
      body: d.seguimientos.map((s) => [
        formatearFecha(s.fecha),
        MEDIO_CONTACTO_META[s.medio],
        s.resumen,
        s.acuerdos || '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Evaluaciones aplicadas
  if (d.evaluaciones.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Instrumento', 'Puntaje', 'Valoración', 'Notas']],
      body: d.evaluaciones.map((e) => [
        formatearFecha(e.fecha),
        e.instrumento_nombre,
        e.puntaje != null ? `${e.puntaje.toFixed(1)}/5` : '—',
        interpretarPuntaje(e.puntaje).etiqueta,
        e.notas || '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Notas del expediente
  if (d.notas.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Tipo', 'Nota']],
      body: d.notas.map((n) => [
        formatearFecha(n.fecha),
        TIPO_NOTA_META[n.tipo].etiqueta,
        (n.titulo ? `${n.titulo}: ` : '') + n.contenido,
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 24 } },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Actividades
  if (d.actividades.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Actividad', 'Objetivo', 'Estado']],
      body: d.actividades.map((a) => [
        formatearFecha(a.fecha),
        (a.titulo || '') + (a.descripcion ? ` — ${a.descripcion}` : ''),
        a.objetivo || '—',
        a.estado === 'realizada' ? 'Realizada' : 'Planeada',
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  notaEnfoque(doc);
  pieEnCadaPagina(doc);
  doc.save(`reporte-${slug(d.nino.nombre)}.pdf`);
}

// ---------------------------------------------------------------------------
// Reporte general
// ---------------------------------------------------------------------------

export interface FilaGeneral {
  nino: Nino;
  totalObs: number;
  dist: Record<Semaforo, number>;
  animo: string;
  alertasAbiertas: number;
}

export async function generarReporteGeneral(filas: FilaGeneral[]) {
  const { JsPDF, autoTable } = await cargarPdf();
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  encabezado(doc, 'Reporte general del grupo', `Emitido: ${fechaEmision()}`);

  const totalObs = filas.reduce((s, f) => s + f.totalObs, 0);
  const totalAlertas = filas.reduce((s, f) => s + f.alertasAbiertas, 0);

  autoTable(doc, {
    startY: 32,
    head: [['Resumen general', '']],
    body: [
      ['Niñas y niños', String(filas.length)],
      ['Observaciones totales', String(totalObs)],
      ['Alertas abiertas', String(totalAlertas)],
    ],
    theme: 'grid',
    headStyles: { fillColor: VERDE },
    styles: { fontSize: 9 },
    margin: { left: MARGEN, right: MARGEN },
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 6,
    head: [['Niña/Niño', 'Grupo', 'Obs.', 'Verde/Amar/Rojo', 'Ánimo', 'Alertas']],
    body: filas.map((f) => [
      f.nino.nombre,
      f.nino.grupo || '—',
      String(f.totalObs),
      `${f.dist.verde} / ${f.dist.amarillo} / ${f.dist.rojo}`,
      f.animo,
      String(f.alertasAbiertas),
    ]),
    theme: 'striped',
    headStyles: { fillColor: VERDE },
    styles: { fontSize: 8, valign: 'top' },
    margin: { left: MARGEN, right: MARGEN },
  });

  notaEnfoque(doc);
  pieEnCadaPagina(doc);
  doc.save('reporte-general-bitacora.pdf');
}

function notaEnfoque(doc: jsPDF) {
  const y = (doc as any).lastAutoTable.finalY + 8;
  const w = doc.internal.pageSize.getWidth();
  doc.setFontSize(7.5);
  doc.setTextColor(120);
  const nota =
    'Enfoque no patologizante: la información describe conductas observables, ' +
    'fortalezas y necesidades de acompañamiento durante el curso de verano. No ' +
    'constituye un diagnóstico clínico ni una evaluación psicológica formal.';
  doc.text(doc.splitTextToSize(nota, w - MARGEN * 2), MARGEN, y);
  doc.setTextColor(0);
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Reporte clínico (paciente)
// ---------------------------------------------------------------------------

export interface DatosReportePaciente {
  paciente: Nino;
  notas: Nota[];
  actividades: Actividad[];
  alertas: Alerta[];
  seguimientos: Seguimiento[];
  evaluaciones: Evaluacion[];
  entrevistas?: Entrevista[];
  guias?: GuiaEntrevista[];
}

export async function generarReportePaciente(d: DatosReportePaciente) {
  const { JsPDF, autoTable } = await cargarPdf();
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  const edad = calcularEdad(d.paciente.fecha_nacimiento);
  encabezado(doc, 'Reporte clínico · Expediente', `Emitido: ${fechaEmision()}`);

  let y = 32;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(d.paciente.nombre, MARGEN, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90);
  const linea = [
    edad != null ? `Edad: ${edad} anios` : null,
    d.paciente.ocupacion ? `Ocupacion: ${d.paciente.ocupacion}` : null,
    d.paciente.telefono ? `Tel: ${d.paciente.telefono}` : null,
    d.paciente.correo ? d.paciente.correo : null,
  ]
    .filter(Boolean)
    .join('    ');
  if (linea) doc.text(linea, MARGEN, y);
  doc.setTextColor(0);
  y += 5;

  // Resumen clínico
  autoTable(doc, {
    startY: y,
    head: [['Informacion clinica', '']],
    body: [
      ['Motivo de consulta', d.paciente.motivo_consulta || '—'],
      ['Antecedentes', d.paciente.antecedentes || '—'],
      ['Plan de trabajo / objetivos', d.paciente.plan_trabajo || '—'],
      ['Notas adicionales', d.paciente.notas || '—'],
    ],
    theme: 'grid',
    headStyles: { fillColor: VERDE },
    styles: { fontSize: 8, cellPadding: 2, valign: 'top' },
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } },
    margin: { left: MARGEN, right: MARGEN },
  });

  // Estadísticas rápidas
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 5,
    head: [['Resumen del expediente', '']],
    body: [
      ['Notas de sesion registradas', String(d.notas.length)],
      ['Actividades', `${d.actividades.filter((a) => a.estado === 'realizada').length} realizadas / ${d.actividades.filter((a) => a.estado === 'planeada').length} planeadas`],
      ['Evaluaciones aplicadas', String(d.evaluaciones.length)],
      ['Alertas abiertas', String(d.alertas.filter((a) => a.estado !== 'cerrada').length)],
      ['Seguimientos', String(d.seguimientos.length)],
    ],
    theme: 'grid',
    headStyles: { fillColor: VERDE },
    styles: { fontSize: 9 },
    margin: { left: MARGEN, right: MARGEN },
  });

  // Entrevistas (anamnesis)
  if (d.entrevistas && d.entrevistas.length) {
    for (const ent of d.entrevistas) {
      const guia = (d.guias ?? []).find((g) => g.id === ent.guia_id);
      const filas: [string, string][] = [];
      if (guia) {
        for (const s of guia.secciones) {
          const respondidas = s.preguntas.filter(
            (p) => (ent.respuestas[p.id] ?? '').trim() !== '',
          );
          if (respondidas.length === 0) continue;
          // fila de sección (subtitulo)
          filas.push([`§ ${s.titulo}`, '']);
          for (const p of respondidas) {
            filas.push([p.texto, ent.respuestas[p.id]]);
          }
        }
      } else {
        Object.values(ent.respuestas).forEach((v, i) =>
          filas.push([`Respuesta ${i + 1}`, String(v)]),
        );
      }
      if (ent.notas) filas.push(['Notas / impresiones', ent.notas]);
      if (filas.length === 0) continue;
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 6,
        head: [[`Entrevista: ${ent.guia_nombre}`, formatearFecha(ent.fecha)]],
        body: filas,
        theme: 'grid',
        headStyles: { fillColor: VERDE },
        styles: { fontSize: 8, valign: 'top', cellPadding: 1.5 },
        columnStyles: { 0: { cellWidth: 70, textColor: [90, 90, 90] } },
        // Resalta las filas de sección
        didParseCell: (data: any) => {
          if (data.section === 'body' && String(data.row.raw[0]).startsWith('§')) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [235, 240, 226];
            data.cell.styles.textColor = [60, 90, 30];
          }
        },
        margin: { left: MARGEN, right: MARGEN },
      });
    }
  }

  // Notas
  if (d.notas.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Tipo', 'Nota']],
      body: d.notas.map((n) => [
        formatearFecha(n.fecha),
        TIPO_NOTA_META[n.tipo].etiqueta,
        (n.titulo ? `${n.titulo}: ` : '') + n.contenido,
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 24 } },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Actividades
  if (d.actividades.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Actividad', 'Objetivo', 'Estado']],
      body: d.actividades.map((a) => [
        formatearFecha(a.fecha),
        (a.titulo || '') + (a.descripcion ? ` — ${a.descripcion}` : ''),
        a.objetivo || '—',
        a.estado === 'realizada' ? 'Realizada' : 'Planeada',
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Evaluaciones
  if (d.evaluaciones.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Instrumento', 'Puntaje', 'Valoracion', 'Notas']],
      body: d.evaluaciones.map((e) => [
        formatearFecha(e.fecha),
        e.instrumento_nombre,
        e.puntaje != null ? `${e.puntaje.toFixed(1)}/5` : '—',
        interpretarPuntaje(e.puntaje).etiqueta,
        e.notas || '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Alertas
  if (d.alertas.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Situacion de atencion', 'Estado', 'Detalle']],
      body: d.alertas.map((a) => [
        a.titulo,
        ESTADO_ALERTA_META[a.estado].etiqueta,
        a.detalle || '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Seguimientos
  if (d.seguimientos.length) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['Fecha', 'Medio', 'Resumen', 'Acuerdos']],
      body: d.seguimientos.map((s) => [
        formatearFecha(s.fecha),
        MEDIO_CONTACTO_META[s.medio],
        s.resumen,
        s.acuerdos || '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: VERDE },
      styles: { fontSize: 8, valign: 'top' },
      margin: { left: MARGEN, right: MARGEN },
    });
  }

  // Nota de confidencialidad clínica
  const yFinal = (doc as any).lastAutoTable?.finalY + 8 || 260;
  const w = doc.internal.pageSize.getWidth();
  doc.setFontSize(7.5);
  doc.setTextColor(120);
  doc.text(doc.splitTextToSize(AVISO_CLINICO, w - MARGEN * 2), MARGEN, yFinal);
  doc.setTextColor(0);

  pieEnCadaPagina(doc);
  doc.save(`expediente-${slug(d.paciente.nombre)}.pdf`);
}
