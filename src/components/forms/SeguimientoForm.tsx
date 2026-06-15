'use client';

import { useState, useRef } from 'react';
import { MEDIO_CONTACTO_META, hoyISO, type MedioContacto } from '@/lib/dominio';

export function SeguimientoForm({
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
      <button onClick={() => setAbierto(true)} className="btn-secondary text-sm">
        + Registrar contacto con tutor
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="sg_fecha">
            Fecha
          </label>
          <input
            id="sg_fecha"
            name="fecha"
            type="date"
            required
            defaultValue={hoyISO()}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="sg_medio">
            Medio
          </label>
          <select id="sg_medio" name="medio" className="input">
            {(Object.keys(MEDIO_CONTACTO_META) as MedioContacto[]).map((m) => (
              <option key={m} value={m}>
                {MEDIO_CONTACTO_META[m]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sg_estado">
            Estado
          </label>
          <select id="sg_estado" name="estado" className="input">
            <option value="realizado">Realizado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
      </div>
      <textarea
        name="resumen"
        required
        rows={2}
        className="input"
        placeholder="Resumen de la conversación *"
      />
      <textarea
        name="acuerdos"
        rows={2}
        className="input"
        placeholder="Acuerdos / próximos pasos"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-sm" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar seguimiento'}
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
