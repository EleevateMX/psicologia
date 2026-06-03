'use client';

import {
  generarReporteIndividual,
  generarReporteGeneral,
  type DatosReporteIndividual,
  type FilaGeneral,
} from '@/lib/pdf';

export function BotonReporteIndividual({
  datos,
  className = 'btn-primary',
  children,
}: {
  datos: DatosReporteIndividual;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => generarReporteIndividual(datos)}
    >
      {children ?? '📄 Descargar PDF'}
    </button>
  );
}

export function BotonReporteGeneral({ filas }: { filas: FilaGeneral[] }) {
  return (
    <button
      type="button"
      className="btn-primary"
      onClick={() => generarReporteGeneral(filas)}
    >
      📄 Descargar reporte general (PDF)
    </button>
  );
}
