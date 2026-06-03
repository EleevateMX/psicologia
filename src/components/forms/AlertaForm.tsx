'use client';

import { useState, useRef } from 'react';

export function AlertaForm({
  action,
}: {
  action: (form: FormData) => Promise<void>;
}) {
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      await action(new FormData(e.currentTarget));
      formRef.current?.reset();
      setAbierto(false);
    } finally {
      setEnviando(false);
    }
  }

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="btn-secondary text-sm">
        + Alerta manual
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
      <input
        name="titulo"
        required
        className="input"
        placeholder="Título de la alerta *"
      />
      <textarea
        name="detalle"
        rows={2}
        className="input"
        placeholder="Detalle (opcional)"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-sm" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Crear alerta'}
        </button>
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => setAbierto(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
