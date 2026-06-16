/**
 * Dominio de "Bitácora de Verano".
 *
 * Enfoque NO patologizante: el lenguaje describe conductas observables y
 * fortalezas, evitando etiquetas diagnósticas. Esta app es un registro
 * observacional socioemocional, no un instrumento clínico.
 */

export type Semaforo = 'verde' | 'amarillo' | 'rojo';

export type Categoria =
  | 'conducta'
  | 'emocional'
  | 'social'
  | 'salud'
  | 'fortalezas';

export type EstadoAlerta = 'abierta' | 'en_seguimiento' | 'cerrada';

export type EstadoSeguimiento = 'pendiente' | 'realizado';

export type MedioContacto =
  | 'presencial'
  | 'telefono'
  | 'mensaje'
  | 'correo'
  | 'otro';

// ---------------------------------------------------------------------------
// Etiquetas legibles + presentación
// ---------------------------------------------------------------------------

export const SEMAFORO_META: Record<
  Semaforo,
  { etiqueta: string; emoji: string; clase: string; descripcion: string }
> = {
  verde: {
    etiqueta: 'Verde',
    emoji: '🟢',
    clase: 'bg-green-100 text-green-800 border-green-300',
    descripcion: 'Todo en orden, sin necesidad de seguimiento especial.',
  },
  amarillo: {
    etiqueta: 'Amarillo',
    emoji: '🟡',
    clase: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    descripcion: 'Conviene observar con atención y dar acompañamiento.',
  },
  rojo: {
    etiqueta: 'Rojo',
    emoji: '🔴',
    clase: 'bg-red-100 text-red-800 border-red-300',
    descripcion: 'Requiere atención y seguimiento con la tutora o tutor.',
  },
};

export const CATEGORIA_META: Record<
  Categoria,
  { etiqueta: string; emoji: string; clase: string; ayuda: string }
> = {
  conducta: {
    etiqueta: 'Conducta',
    emoji: '🧩',
    clase: 'bg-indigo-100 text-indigo-800',
    ayuda: 'Cómo participa, sigue acuerdos y se desenvuelve en la actividad.',
  },
  emocional: {
    etiqueta: 'Emocional',
    emoji: '💗',
    clase: 'bg-pink-100 text-pink-800',
    ayuda: 'Expresión y regulación de emociones, estado de ánimo observado.',
  },
  social: {
    etiqueta: 'Social',
    emoji: '🤝',
    clase: 'bg-sky-100 text-sky-800',
    ayuda: 'Vínculos con compañeras y compañeros, juego y cooperación.',
  },
  salud: {
    etiqueta: 'Salud y bienestar',
    emoji: '🩺',
    clase: 'bg-teal-100 text-teal-800',
    ayuda: 'Energía, descanso, alimentación, higiene y avisos físicos.',
  },
  fortalezas: {
    etiqueta: 'Fortalezas',
    emoji: '⭐',
    clase: 'bg-amber-100 text-amber-800',
    ayuda: 'Logros, talentos, intereses y recursos que mostró.',
  },
};

export const ANIMO_OPCIONES: { valor: number; emoji: string; etiqueta: string }[] = [
  { valor: 1, emoji: '😢', etiqueta: 'Muy bajo' },
  { valor: 2, emoji: '😟', etiqueta: 'Bajo' },
  { valor: 3, emoji: '😐', etiqueta: 'Neutral' },
  { valor: 4, emoji: '🙂', etiqueta: 'Bien' },
  { valor: 5, emoji: '😄', etiqueta: 'Muy bien' },
];

export const ESTADO_ALERTA_META: Record<
  EstadoAlerta,
  { etiqueta: string; clase: string }
> = {
  abierta: { etiqueta: 'Abierta', clase: 'bg-red-100 text-red-800' },
  en_seguimiento: { etiqueta: 'En seguimiento', clase: 'bg-yellow-100 text-yellow-800' },
  cerrada: { etiqueta: 'Cerrada', clase: 'bg-green-100 text-green-800' },
};

export const MEDIO_CONTACTO_META: Record<MedioContacto, string> = {
  presencial: 'Presencial',
  telefono: 'Teléfono',
  mensaje: 'Mensaje',
  correo: 'Correo',
  otro: 'Otro',
};

// ---------------------------------------------------------------------------
// Tema "Safari de Verano" 🦁 — animales para identificar a cada peque y grupos
// ---------------------------------------------------------------------------

export const ANIMALES = [
  '🦁', '🐯', '🐘', '🦒', '🦓', '🦛', '🐊', '🦜', '🐵', '🦍',
  '🐆', '🐅', '🦘', '🐨', '🐼', '🦔', '🦝', '🦊', '🐺', '🦡',
  '🐢', '🦩', '🦚', '🦦', '🦥', '🐍', '🦎', '🐸', '🦏', '🐃',
];

export const GRUPOS_SUGERIDOS = [
  'Leones',
  'Tigres',
  'Elefantes',
  'Jirafas',
  'Monos',
  'Cocodrilos',
];

/** Devuelve un animal estable a partir de una semilla (id o nombre). */
export function animalDe(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ANIMALES[h % ANIMALES.length];
}

/** Animal al azar (para asignar al crear una ficha nueva). */
export function animalAleatorio(): string {
  return ANIMALES[Math.floor(Math.random() * ANIMALES.length)];
}

export const APP = {
  nombre: 'Psico-Note',
  lema: 'Expedientes, notas y acompañamiento psicológico',
};

export const AVISO_CONFIDENCIALIDAD =
  'Aviso de confidencialidad: este registro contiene datos personales de ' +
  'niñas y niños y está protegido. Su uso es exclusivamente para el ' +
  'acompañamiento socioemocional durante el curso de verano. No debe ' +
  'compartirse sin consentimiento de madres, padres o tutores y conforme a ' +
  'la normativa de protección de datos de menores.';

export const AVISO_CLINICO =
  'Aviso de confidencialidad: este expediente contiene información personal ' +
  'y de proceso psicológico. Su uso es exclusivo para el acompañamiento en ' +
  'formación y debe tratarse con la misma ética y discreción que el secreto ' +
  'profesional. No debe compartirse sin consentimiento expreso de la persona ' +
  'y conforme a la normativa de protección de datos personales.';

// ---------------------------------------------------------------------------
// Modelos de datos (almacenados localmente en el dispositivo)
// ---------------------------------------------------------------------------

export type TipoExpediente = 'verano' | 'clinico';

export interface Nino {
  id: string;
  nombre: string;
  animal: string;
  fecha_nacimiento: string | null;
  grupo: string | null;
  tutor_nombre: string | null;
  tutor_contacto: string | null;
  alergias: string | null;
  notas: string | null;
  activo: boolean;
  created_at: string;
  // Discriminator: 'verano' = Curso de Verano, 'clinico' = expediente clínico (adulto/general)
  tipo?: TipoExpediente;
  // Clinical fields (only relevant when tipo === 'clinico')
  ocupacion?: string | null;
  correo?: string | null;
  telefono?: string | null;
  motivo_consulta?: string | null;
  antecedentes?: string | null;
  plan_trabajo?: string | null;
}

export interface Observacion {
  id: string;
  nino_id: string;
  fecha: string;
  categoria: Categoria;
  semaforo: Semaforo;
  descripcion: string;
  acciones: string | null;
  created_at: string;
}

export interface CheckinAnimo {
  id: string;
  nino_id: string;
  fecha: string;
  animo: number;
  nota: string | null;
  created_at: string;
}

export interface Alerta {
  id: string;
  nino_id: string;
  observacion_id: string | null;
  titulo: string;
  detalle: string | null;
  estado: EstadoAlerta;
  created_at: string;
  cerrada_at: string | null;
}

export interface Seguimiento {
  id: string;
  nino_id: string;
  fecha: string;
  medio: MedioContacto;
  resumen: string;
  acuerdos: string | null;
  estado: EstadoSeguimiento;
  created_at: string;
}

// --- Evaluaciones / instrumentos -------------------------------------------

export type TipoItem = 'escala' | 'texto';

export interface ItemInstrumento {
  id: string;
  texto: string;
  tipo: TipoItem;
}

/** Plantilla de evaluación (instrumento) definida por la persona usuaria. */
export interface Instrumento {
  id: string;
  nombre: string;
  descripcion: string | null;
  items: ItemInstrumento[];
  created_at: string;
}

// --- Notas y actividades del expediente ------------------------------------

export type TipoNota = 'sesion' | 'observacion' | 'acuerdo' | 'general';

export const TIPO_NOTA_META: Record<
  TipoNota,
  { etiqueta: string; emoji: string; clase: string }
> = {
  sesion: { etiqueta: 'Sesión', emoji: '🗣️', clase: 'bg-indigo-100 text-indigo-800' },
  observacion: { etiqueta: 'Observación', emoji: '👀', clase: 'bg-sky-100 text-sky-800' },
  acuerdo: { etiqueta: 'Acuerdo', emoji: '🤝', clase: 'bg-emerald-100 text-emerald-800' },
  general: { etiqueta: 'Nota', emoji: '📝', clase: 'bg-slate-100 text-slate-700' },
};

export type EstadoActividad = 'planeada' | 'realizada';

export interface Nota {
  id: string;
  nino_id: string;
  fecha: string;
  tipo: TipoNota;
  titulo: string | null;
  contenido: string;
  created_at: string;
}

export interface Actividad {
  id: string;
  nino_id: string;
  fecha: string;
  titulo: string;
  descripcion: string | null;
  objetivo: string | null;
  estado: EstadoActividad;
  created_at: string;
}

/** Aplicación de un instrumento a un niño en una fecha. */
export interface Evaluacion {
  id: string;
  nino_id: string;
  instrumento_id: string;
  instrumento_nombre: string;
  fecha: string;
  respuestas: Record<string, number | string>;
  puntaje: number | null; // promedio de los ítems de escala (1–5)
  notas: string | null;
  created_at: string;
}

// --- Guías de entrevista (anamnesis) ---------------------------------------

export interface PreguntaGuia {
  id: string;
  texto: string;
  ayuda?: string | null;
}

export interface SeccionGuia {
  id: string;
  titulo: string;
  preguntas: PreguntaGuia[];
}

/** Plantilla de guía de entrevista (editable por la persona usuaria). */
export interface GuiaEntrevista {
  id: string;
  nombre: string;
  descripcion: string | null;
  secciones: SeccionGuia[];
  created_at: string;
}

/** Aplicación de una guía de entrevista a una persona en una fecha. */
export interface Entrevista {
  id: string;
  nino_id: string;
  guia_id: string;
  guia_nombre: string;
  fecha: string;
  // respuestas[preguntaId] = texto de la respuesta
  respuestas: Record<string, string>;
  notas: string | null;
  created_at: string;
}

/**
 * Estructura de la guía de anamnesis estándar precargada. Sin ids: el almacén
 * genera ids estables al sembrarla. Enfoque clínico en formación; la persona
 * usuaria puede editar, agregar o quitar secciones y preguntas libremente.
 */
export const GUIA_ANAMNESIS_ESTANDAR: {
  nombre: string;
  descripcion: string;
  secciones: { titulo: string; preguntas: { texto: string; ayuda?: string }[] }[];
} = {
  nombre: 'Guía de entrevista clínica (anamnesis)',
  descripcion:
    'Historia clínica psicológica de primera entrevista. Adáptala a cada ' +
    'persona; no todas las preguntas aplican a todos los casos.',
  secciones: [
    {
      titulo: 'Ficha de identificación',
      preguntas: [
        { texto: 'Nombre y cómo prefiere que le llamen' },
        { texto: 'Edad y fecha de nacimiento' },
        { texto: 'Escolaridad / grado de estudios' },
        { texto: 'Ocupación actual' },
        { texto: 'Estado civil y con quién vive' },
        { texto: 'Lugar de origen y residencia' },
        { texto: '¿Quién refiere o cómo llega a consulta?' },
      ],
    },
    {
      titulo: 'Motivo de consulta',
      preguntas: [
        { texto: '¿Qué le trae a consulta? (en sus propias palabras)' },
        { texto: '¿Desde cuándo ocurre lo que le preocupa?' },
        { texto: '¿Qué espera lograr con el acompañamiento?' },
      ],
    },
    {
      titulo: 'Historia del padecimiento actual',
      preguntas: [
        { texto: '¿Cómo y cuándo comenzó?', ayuda: 'Inicio, contexto, posibles desencadenantes.' },
        { texto: '¿Cómo ha evolucionado con el tiempo?' },
        { texto: '¿Qué lo agrava y qué lo alivia?' },
        { texto: '¿Cómo afecta su vida diaria (sueño, apetito, trabajo, relaciones)?' },
        { texto: '¿Qué ha intentado para resolverlo?' },
      ],
    },
    {
      titulo: 'Antecedentes personales (desarrollo y salud)',
      preguntas: [
        { texto: 'Embarazo, parto y desarrollo temprano', ayuda: 'Si la persona lo conoce o si es un caso infantil.' },
        { texto: 'Enfermedades, hospitalizaciones o cirugías relevantes' },
        { texto: 'Atención psicológica o psiquiátrica previa y tratamientos' },
        { texto: 'Consumo de sustancias o medicamentos actuales' },
      ],
    },
    {
      titulo: 'Antecedentes familiares',
      preguntas: [
        { texto: 'Estructura y dinámica familiar', ayuda: 'Con quién creció, relaciones significativas.' },
        { texto: 'Antecedentes de salud mental en la familia' },
        { texto: 'Eventos familiares relevantes (pérdidas, cambios, etc.)' },
      ],
    },
    {
      titulo: 'Historia escolar / laboral',
      preguntas: [
        { texto: 'Desempeño y experiencia escolar' },
        { texto: 'Relación con compañeros, docentes o figuras de autoridad' },
        { texto: 'Situación laboral actual y satisfacción' },
      ],
    },
    {
      titulo: 'Área social y de apoyo',
      preguntas: [
        { texto: 'Amistades y vínculos cercanos' },
        { texto: 'Actividades recreativas e intereses' },
        { texto: 'Red de apoyo con la que cuenta' },
      ],
    },
    {
      titulo: 'Observación clínica (examen mental)',
      preguntas: [
        { texto: 'Apariencia, actitud y contacto durante la entrevista' },
        { texto: 'Estado de ánimo y afecto observados' },
        { texto: 'Lenguaje, pensamiento y atención' },
        { texto: 'Orientación (persona, tiempo, lugar)' },
      ],
    },
    {
      titulo: 'Impresión y plan inicial',
      preguntas: [
        { texto: 'Fortalezas y recursos de la persona' },
        { texto: 'Áreas de oportunidad / necesidades de acompañamiento' },
        { texto: 'Acuerdos y plan de trabajo inicial' },
      ],
    },
  ],
};

/** Escala Likert usada por los ítems de tipo "escala". */
export const ESCALA_LIKERT: { valor: number; etiqueta: string }[] = [
  { valor: 1, etiqueta: 'Nunca' },
  { valor: 2, etiqueta: 'Casi nunca' },
  { valor: 3, etiqueta: 'A veces' },
  { valor: 4, etiqueta: 'Casi siempre' },
  { valor: 5, etiqueta: 'Siempre' },
];

/** Interpretación cualitativa, no diagnóstica, de un puntaje promedio 1–5. */
export function interpretarPuntaje(p: number | null): {
  etiqueta: string;
  clase: string;
} {
  if (p == null) return { etiqueta: 'Sin puntaje', clase: 'bg-slate-100 text-slate-600' };
  if (p >= 4) return { etiqueta: 'Favorable', clase: 'bg-green-100 text-green-800' };
  if (p >= 2.5) return { etiqueta: 'En desarrollo', clase: 'bg-yellow-100 text-yellow-800' };
  return { etiqueta: 'Requiere apoyo', clase: 'bg-red-100 text-red-800' };
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

export function calcularEdad(fechaNacimiento: string | null): number | null {
  if (!fechaNacimiento) return null;
  const nac = new Date(fechaNacimiento);
  if (Number.isNaN(nac.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

export function formatearFecha(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatearFechaHora(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}
