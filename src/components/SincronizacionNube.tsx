'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { cifrar, descifrar } from '@/lib/cripto';
import {
  borrarConfig,
  descargarRespaldo,
  guardarConfig,
  leerConfig,
  subirRespaldo,
  SQL_TABLA,
  type ConfigNube,
} from '@/lib/nube';
import { formatearFecha } from '@/lib/dominio';

type Estado =
  | { tipo: 'inactivo' }
  | { tipo: 'trabajando'; texto: string }
  | { tipo: 'ok'; texto: string }
  | { tipo: 'error'; texto: string };

export function SincronizacionNube() {
  const { exportar, importar } = useStore();
  const [config, setConfig] = useState<ConfigNube>({ url: '', anonKey: '', codigo: '' });
  const [frase, setFrase] = useState('');
  const [configurado, setConfigurado] = useState(false);
  const [estado, setEstado] = useState<Estado>({ tipo: 'inactivo' });

  useEffect(() => {
    const guardada = leerConfig();
    if (guardada) {
      setConfig(guardada);
      setConfigurado(true);
    }
  }, []);

  const completa = config.url.trim() && config.anonKey.trim() && config.codigo.trim();

  function onGuardar() {
    if (!completa) {
      setEstado({ tipo: 'error', texto: 'Completa URL, clave anónima y código.' });
      return;
    }
    guardarConfig({
      url: config.url.trim(),
      anonKey: config.anonKey.trim(),
      codigo: config.codigo.trim(),
    });
    setConfigurado(true);
    setEstado({ tipo: 'ok', texto: 'Configuración guardada en este dispositivo ✅' });
  }

  function onDesconectar() {
    borrarConfig();
    setConfig({ url: '', anonKey: '', codigo: '' });
    setConfigurado(false);
    setEstado({ tipo: 'ok', texto: 'Sincronización desconectada de este dispositivo.' });
  }

  async function onSubir() {
    if (!completa) return setEstado({ tipo: 'error', texto: 'Completa la configuración primero.' });
    if (!frase) return setEstado({ tipo: 'error', texto: 'Escribe la frase de cifrado.' });
    setEstado({ tipo: 'trabajando', texto: 'Cifrando y subiendo…' });
    try {
      const cifrado = await cifrar(exportar(), frase);
      await subirRespaldo(config, cifrado);
      setEstado({ tipo: 'ok', texto: 'Respaldo cifrado subido a la nube ✅' });
    } catch (e) {
      setEstado({ tipo: 'error', texto: (e as Error).message });
    }
  }

  async function onRestaurar() {
    if (!completa) return setEstado({ tipo: 'error', texto: 'Completa la configuración primero.' });
    if (!frase) return setEstado({ tipo: 'error', texto: 'Escribe la frase de cifrado.' });
    if (
      !confirm(
        'Esto reemplazará los datos de este dispositivo con el respaldo de la nube. ¿Continuar?',
      )
    )
      return;
    setEstado({ tipo: 'trabajando', texto: 'Descargando y descifrando…' });
    try {
      const remoto = await descargarRespaldo(config);
      if (!remoto) {
        setEstado({ tipo: 'error', texto: 'No hay ningún respaldo con ese código todavía.' });
        return;
      }
      const json = await descifrar(remoto.contenido, frase);
      const ok = importar(json);
      setEstado(
        ok
          ? { tipo: 'ok', texto: `Restaurado desde la nube (${formatearFecha(remoto.actualizado_en.slice(0, 10))}) ✅` }
          : { tipo: 'error', texto: 'El respaldo se descifró pero no es válido.' },
      );
    } catch (e) {
      setEstado({ tipo: 'error', texto: (e as Error).message });
    }
  }

  const trabajando = estado.tipo === 'trabajando';

  return (
    <section className="card space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-700">
          ☁️ Sincronización en la nube (cifrada)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Respaldo opcional entre dispositivos usando tu propio proyecto gratuito de
          Supabase. Tus datos se{' '}
          <strong>cifran en este dispositivo antes de salir</strong>: la nube sólo
          guarda texto ilegible. La frase de cifrado nunca se envía ni se almacena.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        ⚠️ Por tratarse de datos de personas menores de edad, usa una frase de
        cifrado larga y única, y un código de sincronización secreto. Si pierdes la
        frase, el respaldo no se puede recuperar (es la garantía de tu privacidad).
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="nube_url">
            URL del proyecto
          </label>
          <input
            id="nube_url"
            className="input"
            placeholder="https://xxxx.supabase.co"
            value={config.url}
            onChange={(e) => setConfig((c) => ({ ...c, url: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="nube_key">
            Clave anónima (anon key)
          </label>
          <input
            id="nube_key"
            className="input"
            placeholder="eyJhbGciOi…"
            value={config.anonKey}
            onChange={(e) => setConfig((c) => ({ ...c, anonKey: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="nube_codigo">
            Código de sincronización (secreto)
          </label>
          <input
            id="nube_codigo"
            className="input"
            placeholder="p. ej. una frase larga única"
            value={config.codigo}
            onChange={(e) => setConfig((c) => ({ ...c, codigo: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="nube_frase">
            Frase de cifrado
          </label>
          <input
            id="nube_frase"
            type="password"
            className="input"
            placeholder="no se guarda en ningún lado"
            value={frase}
            onChange={(e) => setFrase(e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={onGuardar} className="btn-secondary" disabled={trabajando}>
          💾 Guardar configuración
        </button>
        <button onClick={onSubir} className="btn-primary" disabled={trabajando || !configurado}>
          ⬆️ Subir respaldo cifrado
        </button>
        <button onClick={onRestaurar} className="btn-secondary" disabled={trabajando || !configurado}>
          ⬇️ Restaurar desde la nube
        </button>
        {configurado && (
          <button onClick={onDesconectar} className="btn-danger" disabled={trabajando}>
            Desconectar
          </button>
        )}
      </div>

      {estado.tipo !== 'inactivo' && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            estado.tipo === 'error'
              ? 'bg-red-50 text-red-700'
              : estado.tipo === 'ok'
              ? 'bg-brand-50 text-brand-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {estado.texto}
        </p>
      )}

      <details className="text-xs text-slate-500">
        <summary className="cursor-pointer hover:text-slate-700">
          ¿Cómo lo configuro? (crear proyecto y tabla)
        </summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            Crea una cuenta gratuita en supabase.com y un proyecto nuevo.
          </li>
          <li>
            En <strong>Project Settings → API</strong> copia la URL y la clave{' '}
            <code>anon public</code>.
          </li>
          <li>
            En <strong>SQL Editor</strong> ejecuta una vez este script para crear la
            tabla:
          </li>
        </ol>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
          {SQL_TABLA}
        </pre>
      </details>
    </section>
  );
}
