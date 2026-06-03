import { supabaseConfigurado, FIRMANTE } from '@/lib/config';
import { LoginForm } from './LoginForm';
import { AVISO_CONFIDENCIALIDAD } from '@/lib/dominio';

export const metadata = { title: 'Acceso · Bitácora de Verano' };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-brand-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-3xl">
            ☀️
          </div>
          <h1 className="text-2xl font-bold text-brand-900">
            Bitácora de Verano
          </h1>
          <p className="mt-1 text-sm text-brand-700">
            Registro observacional socioemocional
          </p>
        </div>

        <div className="card">
          {supabaseConfigurado ? (
            <LoginForm />
          ) : (
            <div className="space-y-3 text-sm text-slate-600">
              <h2 className="text-base font-semibold text-slate-800">
                Falta configurar Supabase
              </h2>
              <p>
                Para usar la app, copia{' '}
                <code className="rounded bg-slate-100 px-1">.env.example</code>{' '}
                a <code className="rounded bg-slate-100 px-1">.env.local</code>{' '}
                y agrega tus credenciales de Supabase. Luego aplica{' '}
                <code className="rounded bg-slate-100 px-1">
                  supabase/schema.sql
                </code>{' '}
                en el editor SQL.
              </p>
              <p>Revisa el archivo README para los pasos completos.</p>
            </div>
          )}
        </div>

        <p className="px-2 text-center text-[11px] leading-relaxed text-brand-700/80">
          {AVISO_CONFIDENCIALIDAD}
        </p>
        <p className="text-center text-xs text-brand-700/70">
          {FIRMANTE.nombre} · {FIRMANTE.titulo}
        </p>
      </div>
    </main>
  );
}
