'use client';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  AVISO_CONFIDENCIALIDAD,
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
} from '@/lib/dominio';

const MARGEN = 14;
const VERDE: [number, number, number] = [41, 108, 105];

function nuevaHoja() {
  return new jsPDF({ unit: 'mm', format: 'a4' });
}

function encabezado(doc: jsPDF, titulo: string, subtitulo?: string) {
  doc.setFillColor(...VERDE);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('☀ Bitácora de Verano', MARGEN, 11);
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
}

export function generarReporteIndividual(d: DatosReporteIndividual) {
  const doc = nuevaHoja();
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
        `${SEMAFORO_META.verde.emoji} ${dist.verde}  ·  ${SEMAFORO_META.amarillo.emoji} ${dist.amarillo}  ·  ${SEMAFORO_META.rojo.emoji} ${dist.rojo}`,
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
      head: [['Fecha', 'Categoría', '🚦', 'Observación', 'Acompañamiento']],
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

export function generarReporteGeneral(filas: FilaGeneral[]) {
  const doc = nuevaHoja();
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
    head: [['Niña/Niño', 'Grupo', 'Obs.', '🟢/🟡/🔴', 'Ánimo', 'Alertas']],
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
