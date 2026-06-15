'use client';

import { useState } from 'react';
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
  const [generando, setGenerando] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={generando}
      onClick={async () => {
        setGenerando(true);
        try {
          await generarReporteIndividual(datos);
        } finally {
          setGenerando(false);
        }
      }}
    >
      {generando ? 'Generando PDF…' : (children ?? '📄 Descargar PDF')}
    </button>
  );
}

export function BotonReporteGeneral({ filas }: { filas: FilaGeneral[] }) {
  const [generando, setGenerando] = useState(false);
  return (
    <button
      type="button"
      className="btn-primary"
      disabled={generando}
      onClick={async () => {
        setGenerando(true);
        try {
          await generarReporteGeneral(filas);
        } finally {
          setGenerando(false);
        }
      }}
    >
      {generando ? 'Generando PDF…' : '📄 Descargar reporte general (PDF)'}
    </button>
  );
}
