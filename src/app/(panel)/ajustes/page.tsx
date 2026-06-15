'use client';

import { useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { BotonAccion } from '@/components/BotonAccion';
import { AvisoConfidencialidad } from '@/components/AvisoConfidencialidad';
import { FIRMANTE } from '@/lib/config';

export default function AjustesPage() {
  const { db, cargado, exportar, importar, cargarEjemplo, limpiarTodo } =
    useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (!cargado) return <Cargando />;

  const totales = {
    cachorros: db.ninos.length,
    observaciones: db.observaciones.length,
    checkins: db.checkins.length,
    alertas: db.alertas.length,
    seguimientos: db.seguimientos.length,
  };

  function descargarRespaldo() {
    const blob = new Blob([exportar()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora-verano-respaldo-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMensaje('Respaldo descargado ✅');
  }

  async function onArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = importar(await file.text());
    setMensaje(ok ? 'Respaldo restaurado ✅' : 'El archivo no es válido ❌');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">⚙️ Ajustes y respaldo</h1>
        <p className="text-sm text-slate-500">
          Tus datos viven sólo en este dispositivo.
        </p>
      </div>

      {mensaje && (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
          {mensaje}
        </p>
      )}

      <section className="card space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">📦 En este dispositivo</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 sm:grid-cols-3">
          <li>🐾 {totales.cachorros} cachorros</li>
          <li>🗒️ {totales.observaciones} observaciones</li>
          <li>💗 {totales.checkins} check-ins</li>
          <li>🦁 {totales.alertas} alertas</li>
          <li>🤝 {totales.seguimientos} seguimientos</li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">💾 Respaldo</h2>
        <p className="text-sm text-slate-600">
          Descarga un archivo con todo tu safari para guardarlo o pasarlo a otro
          dispositivo. Restáuralo cuando lo necesites.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={descargarRespaldo} className="btn-primary">
            ⬇️ Descargar respaldo
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="btn-secondary"
          >
            ⬆️ Restaurar respaldo
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            onChange={onArchivo}
            className="hidden"
          />
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">🧪 Datos de ejemplo</h2>
        <p className="text-sm text-slate-600">
          Carga un safari de muestra para explorar la app. Reemplaza los datos
          actuales.
        </p>
        <BotonAccion
          accion={() => {
            cargarEjemplo();
            setMensaje('Datos de ejemplo cargados 🦁');
          }}
          confirmar="Esto reemplazará los datos actuales por los de ejemplo. ¿Continuar?"
          className="btn-secondary"
        >
          Cargar datos de ejemplo
        </BotonAccion>
      </section>

      <section className="card space-y-3 border-red-200">
        <h2 className="text-sm font-semibold text-red-700">🗑️ Borrar todo</h2>
        <p className="text-sm text-slate-600">
          Elimina de forma permanente toda la información de este dispositivo.
          Haz un respaldo antes si quieres conservarla.
        </p>
        <BotonAccion
          accion={() => {
            limpiarTodo();
            setMensaje('Todos los datos fueron borrados.');
          }}
          confirmar="¿Seguro que quieres borrar TODO el safari? Esta acción no se puede deshacer."
          className="btn-danger"
        >
          Borrar todos los datos
        </BotonAccion>
      </section>

      <AvisoConfidencialidad />
      <p className="text-center text-xs text-slate-400">
        {FIRMANTE.nombre} · {FIRMANTE.titulo}
      </p>
    </div>
  );
}
