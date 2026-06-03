'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/', etiqueta: 'Tablero', emoji: '📊' },
  { href: '/ninos', etiqueta: 'Niños', emoji: '🧒' },
  { href: '/alertas', etiqueta: 'Alertas', emoji: '🚨' },
  { href: '/seguimientos', etiqueta: 'Tutores', emoji: '🤝' },
  { href: '/reportes', etiqueta: 'Reportes', emoji: '📄' },
];

function activo(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function BarraLateral() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-2xl">☀️</span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-brand-800">Bitácora</p>
          <p className="text-xs text-slate-500">de Verano</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {ITEMS.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activo(pathname, it.href)
                ? 'bg-brand-50 text-brand-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span aria-hidden>{it.emoji}</span>
            {it.etiqueta}
          </Link>
        ))}
      </nav>
      <form action="/auth/signout" method="post" className="p-3">
        <button className="btn-secondary w-full text-slate-600" type="submit">
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}

export function BarraInferior() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      {ITEMS.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
            activo(pathname, it.href) ? 'text-brand-700' : 'text-slate-500'
          }`}
        >
          <span aria-hidden className="text-lg">
            {it.emoji}
          </span>
          {it.etiqueta}
        </Link>
      ))}
    </nav>
  );
}
