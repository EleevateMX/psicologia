'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Cargando } from '@/components/Cargando';
import { APP } from '@/lib/dominio';
import { AvisoConfidencialidad } from '@/components/AvisoConfidencialidad';
import { FIRMANTE } from '@/lib/config';

export default function InicioPage() {
  const { db, cargado } = useStore();
  if (!cargado) return <Cargando />;

  const totalExpedientes = db.ninos.length;
  const alertasAbiertas = db.alertas.filter((a) => a.estado !== 'cerrada').length;
  const notas = db.notas.length;
  const actividadesPlaneadas = db.actividades.filter(
    (a) => a.estado === 'planeada',
  ).length;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden>
            🧠
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">{APP.nombre}</h1>
            <p className="text-sm text-brand-100">{APP.lema}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Mini valor={totalExpedientes} titulo="Expedientes" />
          <Mini valor={notas} titulo="Notas" />
          <Mini valor={actividadesPlaneadas} titulo="Actividades por hacer" />
          <Mini valor={alertasAbiertas} titulo="Alertas abiertas" />
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <Seccion
          href="/curso"
          emoji="🦁"
          titulo="Curso de Verano · Safari"
          desc="Acompañamiento socioemocional de las niñas y niños del curso."
          activo
        />
        <Seccion
          href="/ninos"
          emoji="🗂️"
          titulo="Expedientes"
          desc="Fichas con notas, actividades, evaluaciones y seguimiento."
          activo
        />
        <Seccion
          href="/evaluaciones"
          emoji="📋"
          titulo="Evaluaciones"
          desc="Tus instrumentos para aplicar y obtener resultados."
          activo
        />
        <Seccion
          href="/reportes"
          emoji="📄"
          titulo="Reportes"
          desc="Exporta a PDF firmado, con aviso de confidencialidad."
          activo
        />
      </section>

      <AvisoConfidencialidad />
      <p className="text-center text-xs text-slate-400">
        {FIRMANTE.nombre} · {FIRMANTE.titulo}
      </p>
    </div>
  );
}

function Mini({ valor, titulo }: { valor: number; titulo: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 text-center backdrop-blur">
      <p className="text-2xl font-bold">{valor}</p>
      <p className="text-[11px] text-brand-100">{titulo}</p>
    </div>
  );
}

function Seccion({
  href,
  emoji,
  titulo,
  desc,
  activo,
}: {
  href: string;
  emoji: string;
  titulo: string;
  desc: string;
  activo?: boolean;
}) {
  const contenido = (
    <>
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {emoji}
        </span>
        <h2 className="font-semibold text-slate-800">{titulo}</h2>
        {!activo && (
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
            Próximamente
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </>
  );
  if (!activo) return <div className="card opacity-70">{contenido}</div>;
  return (
    <Link href={href} className="card transition hover:shadow-md">
      {contenido}
    </Link>
  );
}
