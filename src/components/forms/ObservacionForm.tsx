'use client';

import { useState, useRef } from 'react';
import {
  CATEGORIA_META,
  SEMAFORO_META,
  hoyISO,
  type Categoria,
  type Semaforo,
} from '@/lib/dominio';

export function ObservacionForm({
  action,
}: {
  action: (form: FormData) => Promise<void>;
}) {
  const [abierto, setAbierto] = useState(false);
  const [semaforo, setSemaforo] = useState<Semaforo>('verde');
  const [enviando, setEnviando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      await action(new FormData(e.currentTarget));
      formRef.current?.reset();
      setSemaforo('verde');
      setAbierto(false);
    } finally {
      setEnviando(false);
    }
  }

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="btn-primary">
        + Nueva observación
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="card space-y-4 border-brand-200"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fecha">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={hoyISO()}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="categoria">
            Categoría
          </label>
          <select id="categoria" name="categoria" required className="input">
            {(Object.keys(CATEGORIA_META) as Categoria[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_META[c].emoji} {CATEGORIA_META[c].etiqueta}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="label">Semáforo 🚦</span>
        <div className="flex gap-2">
          {(['verde', 'amarillo', 'rojo'] as Semaforo[]).map((s) => (
            <label
              key={s}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                semaforo === s
                  ? SEMAFORO_META[s].clase
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              <input
                type="radio"
                name="semaforo"
                value={s}
                checked={semaforo === s}
                onChange={() => setSemaforo(s)}
                className="sr-only"
              />
              {SEMAFORO_META[s].emoji} {SEMAFORO_META[s].etiqueta}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {SEMAFORO_META[semaforo].descripcion}
        </p>
      </div>

      <div>
        <label className="label" htmlFor="descripcion">
          ¿Qué observaste? *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          rows={3}
          className="input"
          placeholder="Describe la conducta observable, sin etiquetas ni juicios."
        />
      </div>

      <div>
        <label className="label" htmlFor="acciones">
          Acompañamiento / acciones
        </label>
        <textarea
          id="acciones"
          name="acciones"
          rows={2}
          className="input"
          placeholder="¿Qué se hizo o se propone hacer?"
        />
      </div>

      {semaforo === 'rojo' && (
        <label className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-sm text-red-800">
          <input
            type="checkbox"
            name="crear_alerta"
            defaultChecked
            className="h-4 w-4 rounded border-red-300"
          />
          Generar una alerta de seguimiento a partir de esta observación
        </label>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar observación'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setAbierto(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
