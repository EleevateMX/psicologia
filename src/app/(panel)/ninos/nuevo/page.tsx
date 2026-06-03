import Link from 'next/link';
import { NinoForm } from '@/components/NinoForm';
import { crearNino } from '@/lib/acciones';

export const metadata = { title: 'Nueva ficha · Bitácora de Verano' };

export default function NuevoNinoPage() {
  return (
    <div className="space-y-5">
      <div>
        <Link href="/ninos" className="text-sm text-brand-600 hover:underline">
          ← Niños
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-800">Nueva ficha</h1>
      </div>
      <div className="card">
        <NinoForm action={crearNino} />
      </div>
    </div>
  );
}
