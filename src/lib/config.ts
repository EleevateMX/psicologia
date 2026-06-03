/** Configuración derivada de variables de entorno (lado cliente y servidor). */

export const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const FIRMANTE = {
  nombre: process.env.NEXT_PUBLIC_FIRMANTE_NOMBRE || 'Br. Edy Medina',
  titulo:
    process.env.NEXT_PUBLIC_FIRMANTE_TITULO ||
    'Psicólogo en formación, 6º cuatrimestre, UVM',
};
