'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { TipoItem } from '@/lib/dominio';

interface ItemBorrador {
  texto: string;
  tipo: TipoItem;
}

export default function NuevoInstrumentoPage() {
  const router = useRouter();
  const { agregarInstrumento } = useStore();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [items, setItems] = useState<ItemBorrador[]>([
    { texto: '', tipo: 'escala' },
  ]);

  function setItem(i: number, cambios: Partial<ItemBorrador>) {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...cambios } : it)));
  }
  function agregarItem() {
    setItems((arr) => [...arr, { texto: '', tipo: 'escala' }]);
  }
  function quitarItem(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i));
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const limpios = items
      .map((it) => ({ ...it, texto: it.texto.trim() }))
      .filter((it) => it.texto !== '');
    if (!nombre.trim() || limpios.length === 0) return;
    agregarInstrumento({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      items: limpios,
    });
    router.push('/evaluaciones');
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/evaluaciones" className="text-sm text-brand-600 hover:underline">
          ← Evaluaciones
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">
          Nuevo instrumento
        </h1>
        <p className="text-sm text-slate-500">
          Crea tu propia pauta de evaluación con ítems de escala (1–5) o de texto.
        </p>
      </div>

      <form onSubmit={guardar} className="space-y-4">
        <div className="card space-y-4">
          <div>
            <label className="label" htmlFor="nombre">
              Nombre del instrumento *
            </label>
            <input
              id="nombre"
              className="input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Bienestar socioemocional (breve)"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="descripcion">
              Descripción / instrucciones
            </label>
            <textarea
              id="descripcion"
              rows={2}
              className="input"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Para qué sirve y cómo se aplica."
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Ítems ({items.length})
            </h2>
            <button type="button" onClick={agregarItem} className="btn-secondary text-sm">
              + Añadir ítem
            </button>
          </div>

          {items.map((it, i) => (
            <div key={i} className="card flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-slate-400">{i + 1}.</span>
              <input
                className="input flex-1"
                value={it.texto}
                onChange={(e) => setItem(i, { texto: e.target.value })}
                placeholder="Redacta el ítem (en positivo, sin etiquetas)"
              />
              <select
                className="input sm:w-40"
                value={it.tipo}
                onChange={(e) => setItem(i, { tipo: e.target.value as TipoItem })}
              >
                <option value="escala">Escala 1–5</option>
                <option value="texto">Texto libre</option>
              </select>
              <button
                type="button"
                onClick={() => quitarItem(i)}
                className="text-sm text-slate-400 hover:text-red-600"
                aria-label="Quitar ítem"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            Guardar instrumento
          </button>
          <Link href="/evaluaciones" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
