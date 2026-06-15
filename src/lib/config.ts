/** Datos del profesional que firma los reportes (configurables por entorno). */

export const FIRMANTE = {
  nombre: process.env.NEXT_PUBLIC_FIRMANTE_NOMBRE || 'Br. Edy Medina',
  titulo:
    process.env.NEXT_PUBLIC_FIRMANTE_TITULO ||
    'Psicólogo en formación, 6º cuatrimestre, UVM',
};
