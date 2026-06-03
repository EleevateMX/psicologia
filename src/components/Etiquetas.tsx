import {
  SEMAFORO_META,
  CATEGORIA_META,
  ESTADO_ALERTA_META,
  ANIMO_OPCIONES,
  type Semaforo,
  type Categoria,
  type EstadoAlerta,
} from '@/lib/dominio';

export function SemaforoBadge({ valor }: { valor: Semaforo }) {
  const m = SEMAFORO_META[valor];
  return (
    <span className={`badge ${m.clase}`}>
      <span aria-hidden>{m.emoji}</span>
      {m.etiqueta}
    </span>
  );
}

export function CategoriaBadge({ valor }: { valor: Categoria }) {
  const m = CATEGORIA_META[valor];
  return (
    <span className={`badge border-transparent ${m.clase}`}>
      <span aria-hidden>{m.emoji}</span>
      {m.etiqueta}
    </span>
  );
}

export function EstadoAlertaBadge({ valor }: { valor: EstadoAlerta }) {
  const m = ESTADO_ALERTA_META[valor];
  return <span className={`badge border-transparent ${m.clase}`}>{m.etiqueta}</span>;
}

export function AnimoChip({ valor }: { valor: number }) {
  const m = ANIMO_OPCIONES.find((a) => a.valor === valor) ?? ANIMO_OPCIONES[2];
  return (
    <span className="badge border-slate-200 bg-slate-50 text-slate-700">
      <span aria-hidden className="text-base">
        {m.emoji}
      </span>
      {m.etiqueta}
    </span>
  );
}
