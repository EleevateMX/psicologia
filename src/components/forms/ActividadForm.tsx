'use client';

import { useState, useRef } from 'react';
import { hoyISO } from '@/lib/dominio';

export function ActividadForm({
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
        + Nueva actividad
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card space-y-3 border-brand-200">
      <input name="titulo" required className="input" placeholder="Nombre de la actividad *" />
      <textarea
        name="descripcion"
        rows={2}
        className="input"
        placeholder="¿En qué consiste?"
      />
      <input name="objetivo" className="input" placeholder="Objetivo terapéutico / pedagógico" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="act_fecha">
            Fecha
          </label>
          <input
            id="act_fecha"
            name="fecha"
            type="date"
            required
            defaultValue={hoyISO()}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="act_estado">
            Estado
          </label>
          <select id="act_estado" name="estado" className="input" defaultValue="planeada">
            <option value="planeada">Planeada</option>
            <option value="realizada">Realizada</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar actividad'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setAbierto(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
