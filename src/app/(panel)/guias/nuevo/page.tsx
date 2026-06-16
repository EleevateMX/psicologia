'use client';

import Link from 'next/link';
import { GuiaEditor } from '@/components/GuiaEditor';
import { useStore } from '@/lib/store';

export default function NuevaGuiaPage() {
  const { agregarGuia } = useStore();

  return (
    <div className="space-y-5">
      <div>
        <Link href="/guias" className="text-sm text-brand-600 hover:underline">
          ← Guías de entrevista
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">Nueva guía</h1>
        <p className="text-sm text-slate-500">
          Organiza tus preguntas en secciones. Podrás aplicarla a cualquier
          persona desde su expediente.
        </p>
      </div>
      <GuiaEditor onGuardar={(g) => agregarGuia(g)} volverHref="/guias" />
    </div>
  );
}
