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
  inverso?: boolean; // ítem de puntuación inversa (se invierte antes de sumar)
}

export interface InterpretacionPuntaje {
  desde: number;
  hasta: number;
  etiqueta: string;
  clase: string; // tailwind bg+text
  descripcion?: string;
}

/** Plantilla de evaluación (instrumento) definida por la persona usuaria. */
export interface Instrumento {
  id: string;
  nombre: string;
  descripcion: string | null;
  items: ItemInstrumento[];
  created_at: string;
  // Campos extendidos para escalas clínicas estandarizadas:
  opciones_escala?: { valor: number; etiqueta: string }[]; // si ausente, usa ESCALA_LIKERT
  metodo_puntaje?: 'promedio' | 'suma';                   // default: 'promedio'
  interpretaciones?: InterpretacionPuntaje[];             // rangos cualitativos
  fuente?: string;                                        // referencia bibliográfica
}

/** Interpreta un puntaje usando los rangos del instrumento; si no tiene, usa el genérico. */
export function interpretarConInstrumento(
  puntaje: number | null,
  instrumento?: Instrumento | null,
): { etiqueta: string; clase: string; descripcion?: string } {
  if (puntaje == null) return { etiqueta: 'Sin puntaje', clase: 'bg-slate-100 text-slate-600' };
  const rangos = instrumento?.interpretaciones;
  if (rangos && rangos.length > 0) {
    const rango = rangos.find((r) => puntaje >= r.desde && puntaje <= r.hasta);
    if (rango) return { etiqueta: rango.etiqueta, clase: rango.clase, descripcion: rango.descripcion };
  }
  return interpretarPuntaje(puntaje); // fallback genérico
}

// ---------------------------------------------------------------------------
// Catálogo de escalas de dominio público / libre acceso
// ---------------------------------------------------------------------------

export interface EscalaCatalogo {
  nombre: string;
  abreviatura: string;
  descripcion: string;
  fuente: string;
  opciones_escala: { valor: number; etiqueta: string }[];
  metodo_puntaje: 'promedio' | 'suma';
  interpretaciones: InterpretacionPuntaje[];
  items: { texto: string; inverso?: boolean }[];
}

export const CATALOGO_ESCALAS: EscalaCatalogo[] = [
  {
    nombre: 'PHQ-9 · Cuestionario sobre la Salud del Paciente',
    abreviatura: 'PHQ-9',
    descripcion:
      'Escala de tamizaje y severidad de la depresión. 9 ítems, puntaje 0–27. ' +
      'AVISO: el ítem 9 (ideación suicida) requiere atención inmediata si la ' +
      'respuesta es > 0. Dominio público (Pfizer Inc.).',
    fuente: 'Kroenke K, Spitzer RL, Williams JBW (2001). J Gen Intern Med, 16, 606–613.',
    opciones_escala: [
      { valor: 0, etiqueta: 'Para nada' },
      { valor: 1, etiqueta: 'Varios días' },
      { valor: 2, etiqueta: 'Más de la mitad de los días' },
      { valor: 3, etiqueta: 'Casi todos los días' },
    ],
    metodo_puntaje: 'suma',
    interpretaciones: [
      { desde: 0,  hasta: 4,  etiqueta: 'Mínima',               clase: 'bg-green-100 text-green-800' },
      { desde: 5,  hasta: 9,  etiqueta: 'Leve',                 clase: 'bg-yellow-100 text-yellow-800' },
      { desde: 10, hasta: 14, etiqueta: 'Moderada',             clase: 'bg-orange-100 text-orange-800' },
      { desde: 15, hasta: 19, etiqueta: 'Moderadamente severa', clase: 'bg-red-100 text-red-800' },
      { desde: 20, hasta: 27, etiqueta: 'Severa',               clase: 'bg-red-200 text-red-900' },
    ],
    items: [
      { texto: 'Poco interés o placer en hacer las cosas' },
      { texto: 'Sentirse decaído/a, deprimido/a o sin esperanza' },
      { texto: 'Dificultad para dormir o para dormir demasiado' },
      { texto: 'Cansancio o falta de energía' },
      { texto: 'Poco apetito o comer en exceso' },
      { texto: 'Sentirse mal consigo mismo/a, o sentir que es un fracaso o que le ha fallado a sí mismo/a o a su familia' },
      { texto: 'Dificultad para concentrarse en cosas, como leer el periódico o ver la televisión' },
      { texto: 'Moverse o hablar más lento que de costumbre, o lo contrario: estar tan inquieto/a o agitado/a que se ha estado moviendo más de lo habitual' },
      { texto: 'Pensamientos de que sería mejor estar muerto/a, o de hacerse daño de alguna manera' },
    ],
  },
  {
    nombre: 'GAD-7 · Escala de Trastorno de Ansiedad Generalizada',
    abreviatura: 'GAD-7',
    descripcion:
      'Escala de tamizaje y severidad de la ansiedad generalizada. 7 ítems, puntaje 0–21. ' +
      'Dominio público (Pfizer Inc.).',
    fuente: 'Spitzer RL, Kroenke K, Williams JBW, Löwe B (2006). Arch Intern Med, 166, 1092–1097.',
    opciones_escala: [
      { valor: 0, etiqueta: 'Para nada' },
      { valor: 1, etiqueta: 'Varios días' },
      { valor: 2, etiqueta: 'Más de la mitad de los días' },
      { valor: 3, etiqueta: 'Casi todos los días' },
    ],
    metodo_puntaje: 'suma',
    interpretaciones: [
      { desde: 0,  hasta: 4,  etiqueta: 'Mínima',   clase: 'bg-green-100 text-green-800' },
      { desde: 5,  hasta: 9,  etiqueta: 'Leve',     clase: 'bg-yellow-100 text-yellow-800' },
      { desde: 10, hasta: 14, etiqueta: 'Moderada', clase: 'bg-orange-100 text-orange-800' },
      { desde: 15, hasta: 21, etiqueta: 'Severa',   clase: 'bg-red-100 text-red-800' },
    ],
    items: [
      { texto: 'Sentirse nervioso/a, ansioso/a o con los nervios de punta' },
      { texto: 'No poder dejar de preocuparse o no poder controlar la preocupación' },
      { texto: 'Preocuparse demasiado por diferentes cosas' },
      { texto: 'Dificultad para relajarse' },
      { texto: 'Estar tan inquieto/a que es difícil mantenerse sentado/a tranquilo/a' },
      { texto: 'Molestarse o ponerse irritable fácilmente' },
      { texto: 'Sentir miedo como si fuera a pasar algo terrible' },
    ],
  },
  {
    nombre: 'Escala de Autoestima de Rosenberg',
    abreviatura: 'EAR',
    descripcion:
      'Mide la autoestima global. 10 ítems, puntaje 10–40 (mayor = más autoestima). ' +
      'Los ítems 6–10 son de puntuación inversa. Libre uso para investigación y clínica.',
    fuente: 'Rosenberg M (1965). Society and the Adolescent Self-Image. Princeton University Press.',
    opciones_escala: [
      { valor: 1, etiqueta: 'Muy en desacuerdo' },
      { valor: 2, etiqueta: 'En desacuerdo' },
      { valor: 3, etiqueta: 'De acuerdo' },
      { valor: 4, etiqueta: 'Muy de acuerdo' },
    ],
    metodo_puntaje: 'suma',
    interpretaciones: [
      { desde: 10, hasta: 25, etiqueta: 'Autoestima baja',       clase: 'bg-red-100 text-red-800',    descripcion: 'Posible necesidad de acompañamiento en autoconcepto.' },
      { desde: 26, hasta: 29, etiqueta: 'Autoestima normal',     clase: 'bg-yellow-100 text-yellow-800' },
      { desde: 30, hasta: 40, etiqueta: 'Autoestima elevada',    clase: 'bg-green-100 text-green-800' },
    ],
    items: [
      { texto: 'Siento que soy una persona digna de aprecio, al menos en igual medida que los demás' },
      { texto: 'Estoy convencido/a de que tengo cualidades buenas' },
      { texto: 'Soy capaz de hacer las cosas tan bien como la mayoría de las demás personas' },
      { texto: 'Tengo una actitud positiva hacia mí mismo/a' },
      { texto: 'En general, estoy satisfecho/a de mí mismo/a' },
      { texto: 'Siento que no tengo mucho de lo que estar orgulloso/a', inverso: true },
      { texto: 'En general, me inclino a pensar que soy un fracasado/a', inverso: true },
      { texto: 'Me gustaría poder sentir más respeto por mí mismo/a', inverso: true },
      { texto: 'Hay veces que realmente pienso que soy un/a inútil', inverso: true },
      { texto: 'A veces creo que no soy buena persona', inverso: true },
    ],
  },
  {
    nombre: 'SWLS · Escala de Satisfacción con la Vida',
    abreviatura: 'SWLS',
    descripcion:
      'Mide el bienestar subjetivo global (componente cognitivo). 5 ítems, puntaje 5–35. ' +
      'Libre para uso clínico y educativo.',
    fuente: 'Diener E, Emmons RA, Larsen RJ, Griffin S (1985). J Pers Assess, 49(1), 71–75.',
    opciones_escala: [
      { valor: 1, etiqueta: 'Totalmente en desacuerdo' },
      { valor: 2, etiqueta: 'En desacuerdo' },
      { valor: 3, etiqueta: 'Ligeramente en desacuerdo' },
      { valor: 4, etiqueta: 'Ni de acuerdo ni en desacuerdo' },
      { valor: 5, etiqueta: 'Ligeramente de acuerdo' },
      { valor: 6, etiqueta: 'De acuerdo' },
      { valor: 7, etiqueta: 'Totalmente de acuerdo' },
    ],
    metodo_puntaje: 'suma',
    interpretaciones: [
      { desde: 5,  hasta: 9,  etiqueta: 'Muy insatisfecho/a',          clase: 'bg-red-100 text-red-800' },
      { desde: 10, hasta: 14, etiqueta: 'Insatisfecho/a',               clase: 'bg-red-50 text-red-700' },
      { desde: 15, hasta: 19, etiqueta: 'Ligeramente insatisfecho/a',   clase: 'bg-orange-100 text-orange-800' },
      { desde: 20, hasta: 24, etiqueta: 'Ligeramente satisfecho/a',     clase: 'bg-yellow-100 text-yellow-800' },
      { desde: 25, hasta: 29, etiqueta: 'Satisfecho/a',                 clase: 'bg-green-100 text-green-800' },
      { desde: 30, hasta: 35, etiqueta: 'Muy satisfecho/a',             clase: 'bg-green-200 text-green-900' },
    ],
    items: [
      { texto: 'En la mayoría de los aspectos, mi vida se acerca a mi ideal' },
      { texto: 'Las condiciones de mi vida son excelentes' },
      { texto: 'Estoy satisfecho/a con mi vida' },
      { texto: 'Hasta ahora he conseguido las cosas importantes que quiero en la vida' },
      { texto: 'Si pudiera vivir mi vida de nuevo, no cambiaría casi nada' },
    ],
  },
];

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
