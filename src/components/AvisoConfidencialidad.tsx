import { AVISO_CONFIDENCIALIDAD } from '@/lib/dominio';

export function AvisoConfidencialidad() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
      <span className="font-semibold">🔒 </span>
      {AVISO_CONFIDENCIALIDAD}
    </div>
  );
}
