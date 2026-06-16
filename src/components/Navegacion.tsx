'use client';

import { useState } from 'react';
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

// Bottom bar items (mobile): 4 primarios + botón "Más"
const ITEMS_MOVIL = [
  { href: '/', etiqueta: 'Inicio', emoji: '🏠' },
  { href: '/curso', etiqueta: 'Curso', emoji: '🦁' },
  { href: '/pacientes', etiqueta: 'Pacientes', emoji: '👤' },
  { href: '/evaluaciones', etiqueta: 'Evaluar', emoji: '📋' },
];

// Secciones que viven en el menú "Más" del móvil
const ITEMS_MAS = [
  { href: '/ninos', etiqueta: 'Fichas del Curso', emoji: '🐾' },
  { href: '/guias', etiqueta: 'Guías de entrevista', emoji: '📝' },
  { href: '/analisis', etiqueta: 'Análisis', emoji: '📊' },
  { href: '/reportes', etiqueta: 'Reportes', emoji: '📄' },
  { href: '/ajustes', etiqueta: 'Ajustes y respaldo', emoji: '⚙️' },
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
  const [masAbierto, setMasAbierto] = useState(false);
  const masActivo = ITEMS_MAS.some((it) => activo(pathname, it.href));

  return (
    <>
      {/* Hoja "Más" (bottom sheet) */}
      {masAbierto && (
        <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMasAbierto(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-brand-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />
            <ul className="space-y-1">
              {ITEMS_MAS.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setMasAbierto(false)}
                    aria-current={activo(pathname, it.href) ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      activo(pathname, it.href)
                        ? 'bg-brand-100 text-brand-800'
                        : 'text-slate-600 hover:bg-brand-50'
                    }`}
                  >
                    <span aria-hidden className="text-xl">
                      {it.emoji}
                    </span>
                    {it.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-brand-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
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
        <button
          type="button"
          onClick={() => setMasAbierto((v) => !v)}
          aria-expanded={masAbierto}
          aria-label="Más secciones"
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
            masActivo || masAbierto ? 'text-brand-700' : 'text-slate-500'
          }`}
        >
          <span aria-hidden className="text-lg">
            ☰
          </span>
          Más
        </button>
      </nav>
    </>
  );
}
