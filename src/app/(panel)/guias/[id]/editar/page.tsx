'use client';

import Link from 'next/link';
import { GuiaEditor } from '@/components/GuiaEditor';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';

export default function EditarGuiaPage({ params }: { params: { id: string } }) {
  const { db, cargado, actualizarGuia } = useStore();
  if (!cargado) return <Cargando />;

  const guia = db.guias.find((g) => g.id === params.id);
  if (!guia) {
    return (
      <div className="card text-center text-sm text-slate-500">
        No encontramos esta guía.{' '}
        <Link href="/guias" className="text-brand-600 hover:underline">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/guias" className="text-sm text-brand-600 hover:underline">
          ← Guías de entrevista
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">Editar guía</h1>
      </div>
      <GuiaEditor
        inicial={guia}
        onGuardar={(g) => actualizarGuia(guia.id, g)}
        volverHref="/guias"
      />
    </div>
  );
}
