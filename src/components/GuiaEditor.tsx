'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { GuiaEntrevista } from '@/lib/dominio';

interface PreguntaB {
  texto: string;
  ayuda: string;
}
interface SeccionB {
  titulo: string;
  preguntas: PreguntaB[];
}

interface Props {
  inicial?: GuiaEntrevista;
  onGuardar: (g: {
    nombre: string;
    descripcion: string | null;
    secciones: { titulo: string; preguntas: { texto: string; ayuda: string | null }[] }[];
  }) => void;
  volverHref: string;
}

export function GuiaEditor({ inicial, onGuardar, volverHref }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');
  const [secciones, setSecciones] = useState<SeccionB[]>(
    inicial
      ? inicial.secciones.map((s) => ({
          titulo: s.titulo,
          preguntas: s.preguntas.map((p) => ({ texto: p.texto, ayuda: p.ayuda ?? '' })),
        }))
      : [{ titulo: '', preguntas: [{ texto: '', ayuda: '' }] }],
  );

  function setSeccion(i: number, cambios: Partial<SeccionB>) {
    setSecciones((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...cambios } : s)));
  }
  function agregarSeccion() {
    setSecciones((arr) => [...arr, { titulo: '', preguntas: [{ texto: '', ayuda: '' }] }]);
  }
  function quitarSeccion(i: number) {
    setSecciones((arr) => arr.filter((_, idx) => idx !== i));
  }
  function setPregunta(si: number, pi: number, cambios: Partial<PreguntaB>) {
    setSecciones((arr) =>
      arr.map((s, idx) =>
        idx !== si
          ? s
          : {
              ...s,
              preguntas: s.preguntas.map((p, j) => (j === pi ? { ...p, ...cambios } : p)),
            },
      ),
    );
  }
  function agregarPregunta(si: number) {
    setSecciones((arr) =>
      arr.map((s, idx) =>
        idx === si ? { ...s, preguntas: [...s.preguntas, { texto: '', ayuda: '' }] } : s,
      ),
    );
  }
  function quitarPregunta(si: number, pi: number) {
    setSecciones((arr) =>
      arr.map((s, idx) =>
        idx === si ? { ...s, preguntas: s.preguntas.filter((_, j) => j !== pi) } : s,
      ),
    );
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const limpias = secciones
      .map((s) => ({
        titulo: s.titulo.trim(),
        preguntas: s.preguntas
          .map((p) => ({ texto: p.texto.trim(), ayuda: p.ayuda.trim() || null }))
          .filter((p) => p.texto !== ''),
      }))
      .filter((s) => s.titulo !== '' && s.preguntas.length > 0);
    if (!nombre.trim() || limpias.length === 0) return;
    onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      secciones: limpias,
    });
    router.push(volverHref);
  }

  return (
    <form onSubmit={guardar} className="space-y-4">
      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="g_nombre">
            Nombre de la guía *
          </label>
          <input
            id="g_nombre"
            className="input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Guía de entrevista clínica (anamnesis)"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="g_desc">
            Descripción / instrucciones
          </label>
          <textarea
            id="g_desc"
            rows={2}
            className="input"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Para qué sirve y cómo se aplica."
          />
        </div>
      </div>

      {secciones.map((s, si) => (
        <div key={si} className="card space-y-3 border-brand-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-400">{si + 1}.</span>
            <input
              className="input flex-1 font-medium"
              value={s.titulo}
              onChange={(e) => setSeccion(si, { titulo: e.target.value })}
              placeholder="Título de la sección (ej. Motivo de consulta)"
            />
            <button
              type="button"
              onClick={() => quitarSeccion(si)}
              className="text-sm text-slate-400 hover:text-red-600"
            >
              Quitar
            </button>
          </div>

          <div className="space-y-2 pl-5">
            {s.preguntas.map((p, pi) => (
              <div key={pi} className="flex flex-col gap-1 sm:flex-row sm:items-start">
                <span className="pt-2 text-xs text-slate-300">{pi + 1}.</span>
                <div className="flex-1 space-y-1">
                  <input
                    className="input"
                    value={p.texto}
                    onChange={(e) => setPregunta(si, pi, { texto: e.target.value })}
                    placeholder="Escribe la pregunta"
                  />
                  <input
                    className="input text-xs"
                    value={p.ayuda}
                    onChange={(e) => setPregunta(si, pi, { ayuda: e.target.value })}
                    placeholder="Ayuda / aclaración (opcional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => quitarPregunta(si, pi)}
                  className="pt-2 text-xs text-slate-400 hover:text-red-600"
                  aria-label="Quitar pregunta"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => agregarPregunta(si)}
              className="text-sm text-brand-600 hover:underline"
            >
              + Añadir pregunta
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={agregarSeccion} className="btn-secondary text-sm">
        + Añadir sección
      </button>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          Guardar guía
        </button>
        <Link href={volverHref} className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
