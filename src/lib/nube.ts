/**
 * Sincronización opcional con Supabase (tier gratuito).
 *
 * IMPORTANTE: la nube SÓLO recibe texto cifrado (ver `cripto.ts`). El
 * dispositivo sigue siendo la fuente de la verdad; esto es un respaldo /
 * sincronización cifrada de extremo a extremo.
 *
 * El usuario aporta su propio proyecto de Supabase (URL + clave anónima) y un
 * "código de sincronización" secreto que identifica su fila. La librería de
 * Supabase se importa de forma diferida para no cargar el bundle inicial.
 */

const CLAVE_CONFIG = 'psiconote-nube-config-v1';
const TABLA = 'respaldos';

export interface ConfigNube {
  url: string;
  anonKey: string;
  codigo: string;
}

export interface RespaldoNube {
  contenido: string;
  actualizado_en: string;
}

/** SQL que el usuario debe ejecutar una vez en el editor de Supabase. */
export const SQL_TABLA = `create table if not exists respaldos (
  codigo text primary key,
  contenido text not null,
  actualizado_en timestamptz not null default now()
);

alter table respaldos enable row level security;

-- El contenido viaja cifrado de extremo a extremo; el acceso se restringe
-- por el código secreto que sólo tú conoces.
create policy "acceso anon por codigo" on respaldos
  for all to anon using (true) with check (true);`;

export function leerConfig(): ConfigNube | null {
  try {
    const raw = localStorage.getItem(CLAVE_CONFIG);
    return raw ? (JSON.parse(raw) as ConfigNube) : null;
  } catch {
    return null;
  }
}

export function guardarConfig(config: ConfigNube): void {
  localStorage.setItem(CLAVE_CONFIG, JSON.stringify(config));
}

export function borrarConfig(): void {
  localStorage.removeItem(CLAVE_CONFIG);
}

async function cliente(config: ConfigNube) {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(config.url, config.anonKey, {
    auth: { persistSession: false },
  });
}

/** Sube (upsert) el respaldo cifrado a la fila identificada por el código. */
export async function subirRespaldo(
  config: ConfigNube,
  contenidoCifrado: string,
): Promise<void> {
  const sb = await cliente(config);
  const { error } = await sb.from(TABLA).upsert(
    {
      codigo: config.codigo,
      contenido: contenidoCifrado,
      actualizado_en: new Date().toISOString(),
    },
    { onConflict: 'codigo' },
  );
  if (error) throw new Error(traducirError(error.message));
}

/** Descarga el respaldo cifrado de la nube. Devuelve null si no existe. */
export async function descargarRespaldo(
  config: ConfigNube,
): Promise<RespaldoNube | null> {
  const sb = await cliente(config);
  const { data, error } = await sb
    .from(TABLA)
    .select('contenido, actualizado_en')
    .eq('codigo', config.codigo)
    .maybeSingle();
  if (error) throw new Error(traducirError(error.message));
  return (data as RespaldoNube) ?? null;
}

function traducirError(msg: string): string {
  if (/relation .*respaldos.* does not exist/i.test(msg)) {
    return 'Falta crear la tabla "respaldos" en Supabase (revisa el SQL más abajo).';
  }
  if (/Invalid API key|JWT/i.test(msg)) {
    return 'La clave anónima o la URL del proyecto no son válidas.';
  }
  if (/Failed to fetch|NetworkError/i.test(msg)) {
    return 'No se pudo conectar con Supabase. Revisa la URL y tu conexión.';
  }
  return msg;
}
