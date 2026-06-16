/**
 * Cifrado de extremo a extremo (E2E) para el respaldo en la nube.
 *
 * Toda la base de datos se cifra en el navegador con una frase secreta ANTES
 * de salir del dispositivo. La nube (Supabase) sólo guarda texto cifrado que
 * es ilegible sin la frase. Esto protege los datos sensibles de las y los
 * menores aunque viajen por la red.
 *
 * Algoritmo: PBKDF2 (SHA-256, 250 000 iteraciones) para derivar la llave,
 * y AES-GCM de 256 bits para cifrar. Ambos vienen en WebCrypto (nativo del
 * navegador): no se añade ninguna dependencia.
 */

const ITERACIONES = 250_000;
const VERSION = 1;

/** Estructura del paquete cifrado (se serializa a JSON y luego a base64). */
interface PaqueteCifrado {
  v: number;
  salt: string; // base64
  iv: string; // base64
  ct: string; // base64 (texto cifrado)
}

function aBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function deBase64(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytes(texto: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(texto) as Uint8Array<ArrayBuffer>;
}

async function derivarLlave(
  frase: string,
  salt: BufferSource,
): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    bytes(frase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERACIONES, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Cifra un texto con la frase. Devuelve un string base64 listo para guardar. */
export async function cifrar(texto: string, frase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const llave = await derivarLlave(frase, salt);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    llave,
    bytes(texto),
  );
  const paquete: PaqueteCifrado = {
    v: VERSION,
    salt: aBase64(salt.buffer),
    iv: aBase64(iv.buffer),
    ct: aBase64(ct),
  };
  return btoa(JSON.stringify(paquete));
}

/** Descifra un paquete base64 con la frase. Lanza error si la frase es incorrecta. */
export async function descifrar(empaquetado: string, frase: string): Promise<string> {
  let paquete: PaqueteCifrado;
  try {
    paquete = JSON.parse(atob(empaquetado));
  } catch {
    throw new Error('El respaldo en la nube está dañado o no es válido.');
  }
  const salt = deBase64(paquete.salt);
  const iv = deBase64(paquete.iv);
  const llave = await derivarLlave(frase, salt);
  try {
    const texto = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      llave,
      deBase64(paquete.ct),
    );
    return new TextDecoder().decode(texto);
  } catch {
    throw new Error('Frase de cifrado incorrecta o respaldo corrupto.');
  }
}
