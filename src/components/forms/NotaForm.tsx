'use client';

import { useState, useRef } from 'react';
import { TIPO_NOTA_META, hoyISO, type TipoNota } from '@/lib/dominio';

export function NotaForm({
  action,
}: {
  action: (form: FormData) => void | Promise<void>;
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
      <button onClick={() => setAbierto(true)} className="btn-primary">
        + Nueva nota
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card space-y-3 border-brand-200">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="nota_tipo">
            Tipo de nota
          </label>
          <select id="nota_tipo" name="tipo" className="input" defaultValue="general">
            {(Object.keys(TIPO_NOTA_META) as TipoNota[]).map((t) => (
              <option key={t} value={t}>
                {TIPO_NOTA_META[t].emoji} {TIPO_NOTA_META[t].etiqueta}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="nota_fecha">
            Fecha
          </label>
          <input
            id="nota_fecha"
            name="fecha"
            type="date"
            required
            defaultValue={hoyISO()}
            className="input"
          />
        </div>
      </div>
      <input name="titulo" className="input" placeholder="Título (opcional)" />
      <textarea
        name="contenido"
        required
        rows={4}
        className="input"
        placeholder="Escribe la nota… (qué pasó, cómo se trabajó, observaciones)"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar nota'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setAbierto(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
