'use client';

import { useState, useRef } from 'react';
import { ANIMO_OPCIONES, hoyISO } from '@/lib/dominio';

export function CheckinForm({
  action,
}: {
  action: (form: FormData) => Promise<void>;
}) {
  const [animo, setAnimo] = useState(3);
  const [enviando, setEnviando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      await action(new FormData(e.currentTarget));
      formRef.current?.reset();
      setAnimo(3);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
      <div className="flex justify-between gap-1">
        {ANIMO_OPCIONES.map((a) => (
          <label
            key={a.valor}
            className={`flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg border-2 py-2 transition ${
              animo === a.valor
                ? 'border-brand-400 bg-brand-50'
                : 'border-transparent hover:bg-slate-50'
            }`}
            title={a.etiqueta}
          >
            <input
              type="radio"
              name="animo"
              value={a.valor}
              checked={animo === a.valor}
              onChange={() => setAnimo(a.valor)}
              className="sr-only"
            />
            <span className="text-2xl" aria-hidden>
              {a.emoji}
            </span>
            <span className="text-[10px] text-slate-500">{a.etiqueta}</span>
          </label>
        ))}
      </div>
      <input type="hidden" name="fecha" value={hoyISO()} readOnly />
      <input
        name="nota"
        className="input"
        placeholder="Nota breve (opcional)"
      />
      <button type="submit" className="btn-primary w-full" disabled={enviando}>
        {enviando ? 'Guardando…' : 'Registrar ánimo de hoy'}
      </button>
    </form>
  );
}
