'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Sidebar items (desktop): full list
const ITEMS_SIDEBAR = [
  { href: '/', etiqueta: 'Inicio', emoji: '🏠' },
  { href: '/curso', etiqueta: 'Curso de Verano', emoji: '🦁' },
  { href: '/ninos', etiqueta: 'Fichas del Curso', emoji: '🐾', sub: true },
  { href: '/pacientes', etiqueta: 'Pacientes', emoji: '👤' },
  { href: '/evaluaciones', etiqueta: 'Evaluaciones', emoji: '📋' },
  { href: '/guias', etiqueta: 'Guías de entrevista', emoji: '📝' },
  { href: '/analisis', etiqueta: 'Análisis', emoji: '📊' },
  { href: '/reportes', etiqueta: 'Reportes', emoji: '📄' },
];

// Bottom bar items (mobile): 5 slots max
const ITEMS_MOVIL = [
  { href: '/', etiqueta: 'Inicio', emoji: '🏠' },
  { href: '/curso', etiqueta: 'Curso', emoji: '🦁' },
  { href: '/pacientes', etiqueta: 'Pacientes', emoji: '👤' },
  { href: '/evaluaciones', etiqueta: 'Evaluar', emoji: '📋' },
  { href: '/reportes', etiqueta: 'Reportes', emoji: '📄' },
];

function activo(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function BarraLateral() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-brand-100 bg-white/80 backdrop-blur md:flex md:flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-2xl">🧠</span>
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-brand-800">Psico-Note</p>
          <p className="text-xs font-medium text-sabana-600">Expedientes &amp; notas</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {ITEMS_SIDEBAR.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            aria-current={activo(pathname, it.href) ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              'sub' in it && it.sub ? 'ml-4' : ''
            } ${
              activo(pathname, it.href)
                ? 'bg-brand-100 text-brand-800'
                : 'text-slate-600 hover:bg-brand-50'
            }`}
          >
            <span aria-hidden>{it.emoji}</span>
            {it.etiqueta}
          </Link>
        ))}
      </nav>
      <div className="p-3">
        <Link
          href="/ajustes"
          aria-current={activo(pathname, '/ajustes') ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
            activo(pathname, '/ajustes')
              ? 'bg-brand-100 text-brand-800'
              : 'text-slate-500 hover:bg-brand-50'
          }`}
        >
          <span aria-hidden>⚙️</span>
          Ajustes y respaldo
        </Link>
      </div>
    </aside>
  );
}

export function BarraInferior() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-brand-100 bg-white/95 backdrop-blur md:hidden">
      {ITEMS_MOVIL.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-current={activo(pathname, it.href) ? 'page' : undefined}
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
