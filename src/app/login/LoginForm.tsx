'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAviso(null);
    setCargando(true);
    const supabase = createClient();

    try {
      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace('/');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          router.replace('/');
          router.refresh();
        } else {
          setAviso(
            'Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.',
          );
          setModo('login');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ocurrió un error';
      setError(
        msg === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : msg,
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="monitor@ejemplo.com"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={6}
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {aviso && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {aviso}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={cargando}>
        {cargando
          ? 'Procesando…'
          : modo === 'login'
            ? 'Entrar'
            : 'Crear cuenta'}
      </button>

      <p className="text-center text-sm text-slate-500">
        {modo === 'login' ? '¿Primera vez? ' : '¿Ya tienes cuenta? '}
        <button
          type="button"
          className="font-medium text-brand-600 hover:underline"
          onClick={() => {
            setModo(modo === 'login' ? 'registro' : 'login');
            setError(null);
            setAviso(null);
          }}
        >
          {modo === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
      </p>
    </form>
  );
}
