'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { CATALOGO_ESCALAS } from '@/lib/dominio';

export default function CatalogoPage() {
  const { db, agregarInstrumento } = useStore();

  function importar(escala: (typeof CATALOGO_ESCALAS)[0]) {
    agregarInstrumento({
      nombre: escala.nombre,
      descripcion: escala.descripcion,
      fuente: escala.fuente,
      opciones_escala: escala.opciones_escala,
      metodo_puntaje: escala.metodo_puntaje,
      interpretaciones: escala.interpretaciones,
      items: escala.items.map((it) => ({
        texto: it.texto,
        tipo: 'escala' as const,
        inverso: it.inverso,
      })),
    });
  }

  const yaImportado = (nombre: string) =>
    db.instrumentos.some((i) => i.nombre === nombre);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/evaluaciones" className="text-sm text-brand-600 hover:underline">
          ← Evaluaciones
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">
          📚 Catálogo de escalas
        </h1>
        <p className="text-sm text-slate-500">
          Escalas de dominio público o libre uso clínico. Impórtalas con un
          clic; se agregan a tus instrumentos con baremos ya configurados.
        </p>
      </div>

      <div className="space-y-4">
        {CATALOGO_ESCALAS.map((escala) => {
          const importada = yaImportado(escala.nombre);
          return (
            <div key={escala.abreviatura} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">
                      {escala.abreviatura}
                    </span>
                    <h2 className="font-semibold text-slate-800">{escala.nombre}</h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {escala.items.length} ítems · escala {escala.opciones_escala[0].valor}–
                    {escala.opciones_escala[escala.opciones_escala.length - 1].valor} ·{' '}
                    puntaje por {escala.metodo_puntaje}
                  </p>
                </div>
                {importada ? (
                  <span className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800">
                    ✓ Ya importada
                  </span>
                ) : (
                  <button
                    onClick={() => importar(escala)}
                    className="btn-primary text-sm"
                  >
                    Importar al catálogo
                  </button>
                )}
              </div>

              <p className="text-sm text-slate-600">{escala.descripcion}</p>

              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">
                  Interpretación del puntaje:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {escala.interpretaciones.map((r) => (
                    <span
                      key={r.etiqueta}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${r.clase}`}
                    >
                      {r.desde}–{r.hasta}: {r.etiqueta}
                    </span>
                  ))}
                </div>
              </div>

              <details className="text-xs text-slate-500">
                <summary className="cursor-pointer hover:text-slate-700">
                  Ver ítems ({escala.items.length})
                </summary>
                <ol className="mt-2 list-decimal space-y-0.5 pl-5">
                  {escala.items.map((it, i) => (
                    <li key={i}>
                      {it.texto}
                      {it.inverso && (
                        <span className="ml-1 italic text-slate-400">(inverso)</span>
                      )}
                    </li>
                  ))}
                </ol>
              </details>

              <p className="text-[10px] text-slate-400">Fuente: {escala.fuente}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
        <strong>Aviso:</strong> Estas escalas son herramientas de tamizaje en formación.
        Sus resultados no sustituyen una evaluación clínica formal ni constituyen un
        diagnóstico. Úsalas como apoyo observacional y regístralas con el contexto
        cualitativo en las notas del expediente.
      </div>
    </div>
  );
}
