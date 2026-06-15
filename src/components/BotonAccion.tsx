'use client';

import { useState } from 'react';

/** Botón que ejecuta una Server Action (pasada como prop) con estado de carga. */
export function BotonAccion({
  accion,
  children,
  className = 'btn-secondary text-xs',
  confirmar,
}: {
  accion: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  confirmar?: string;
}) {
  const [cargando, setCargando] = useState(false);

  async function onClick() {
    if (confirmar && !window.confirm(confirmar)) return;
    setCargando(true);
    try {
      await accion();
    } finally {
      setCargando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={cargando}
      className={className}
    >
      {cargando ? '…' : children}
    </button>
  );
}
