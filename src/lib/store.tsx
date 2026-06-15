'use client';

/**
 * Almacén local "Bitácora de Verano".
 *
 * Toda la información vive en el dispositivo (localStorage). No requiere
 * servidores ni cuentas: la app funciona al instante y sin conexión, y los
 * datos sensibles de las y los menores NO salen del equipo.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  Nino,
  Observacion,
  CheckinAnimo,
  Alerta,
  Seguimiento,
  EstadoAlerta,
  EstadoSeguimiento,
  MedioContacto,
} from '@/lib/dominio';
import { animalAleatorio, GRUPOS_SUGERIDOS } from '@/lib/dominio';

const CLAVE = 'bitacora-verano-v1';

export interface BaseDatos {
  ninos: Nino[];
  observaciones: Observacion[];
  checkins: CheckinAnimo[];
  alertas: Alerta[];
  seguimientos: Seguimiento[];
}

const VACIA: BaseDatos = {
  ninos: [],
  observaciones: [],
  checkins: [],
  alertas: [],
  seguimientos: [],
};

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const ahora = () => new Date().toISOString();

// Tipos de entrada (sin campos autogenerados) ------------------------------
type NuevoNino = Omit<Nino, 'id' | 'created_at' | 'animal' | 'activo'> & {
  animal?: string;
  activo?: boolean;
};
type NuevaObservacion = Omit<Observacion, 'id' | 'created_at'> & {
  crearAlerta?: boolean;
};
type NuevoCheckin = Omit<CheckinAnimo, 'id' | 'created_at'>;
type NuevaAlerta = Omit<Alerta, 'id' | 'created_at' | 'estado' | 'cerrada_at'>;
type NuevoSeguimiento = Omit<Seguimiento, 'id' | 'created_at'>;

interface StoreCtx {
  db: BaseDatos;
  cargado: boolean;
  // Niños
  agregarNino: (n: NuevoNino) => Nino;
  actualizarNino: (id: string, cambios: Partial<Nino>) => void;
  eliminarNino: (id: string) => void;
  // Observaciones
  agregarObservacion: (o: NuevaObservacion) => void;
  eliminarObservacion: (id: string) => void;
  // Check-ins
  agregarCheckin: (c: NuevoCheckin) => void;
  // Alertas
  agregarAlerta: (a: NuevaAlerta) => void;
  cambiarEstadoAlerta: (id: string, estado: EstadoAlerta) => void;
  // Seguimientos
  agregarSeguimiento: (s: NuevoSeguimiento) => void;
  cambiarEstadoSeguimiento: (id: string, estado: EstadoSeguimiento) => void;
  // Datos
  cargarEjemplo: () => void;
  limpiarTodo: () => void;
  exportar: () => string;
  importar: (json: string) => boolean;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<BaseDatos>(VACIA);
  const [cargado, setCargado] = useState(false);

  // Carga inicial desde el dispositivo (sólo en el navegador).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) setDb({ ...VACIA, ...JSON.parse(raw) });
    } catch {
      /* localStorage no disponible o dato corrupto: empezamos en blanco. */
    }
    setCargado(true);
  }, []);

  // Persiste cada cambio una vez cargado.
  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(db));
    } catch {
      /* Sin almacenamiento (modo privado lleno): se mantiene en memoria. */
    }
  }, [db, cargado]);

  const agregarNino = useCallback((n: NuevoNino): Nino => {
    const nuevo: Nino = {
      id: uid(),
      created_at: ahora(),
      activo: n.activo ?? true,
      animal: n.animal || animalAleatorio(),
      nombre: n.nombre,
      fecha_nacimiento: n.fecha_nacimiento ?? null,
      grupo: n.grupo ?? null,
      tutor_nombre: n.tutor_nombre ?? null,
      tutor_contacto: n.tutor_contacto ?? null,
      alergias: n.alergias ?? null,
      notas: n.notas ?? null,
    };
    setDb((d) => ({ ...d, ninos: [...d.ninos, nuevo] }));
    return nuevo;
  }, []);

  const actualizarNino = useCallback((id: string, cambios: Partial<Nino>) => {
    setDb((d) => ({
      ...d,
      ninos: d.ninos.map((n) => (n.id === id ? { ...n, ...cambios } : n)),
    }));
  }, []);

  const eliminarNino = useCallback((id: string) => {
    setDb((d) => ({
      ninos: d.ninos.filter((n) => n.id !== id),
      observaciones: d.observaciones.filter((o) => o.nino_id !== id),
      checkins: d.checkins.filter((c) => c.nino_id !== id),
      alertas: d.alertas.filter((a) => a.nino_id !== id),
      seguimientos: d.seguimientos.filter((s) => s.nino_id !== id),
    }));
  }, []);

  const agregarObservacion = useCallback((o: NuevaObservacion) => {
    const id = uid();
    const obs: Observacion = {
      id,
      created_at: ahora(),
      nino_id: o.nino_id,
      fecha: o.fecha,
      categoria: o.categoria,
      semaforo: o.semaforo,
      descripcion: o.descripcion,
      acciones: o.acciones ?? null,
    };
    setDb((d) => {
      const alertas = [...d.alertas];
      if (o.semaforo === 'rojo' && o.crearAlerta) {
        alertas.unshift({
          id: uid(),
          created_at: ahora(),
          nino_id: o.nino_id,
          observacion_id: id,
          titulo: `Alerta: ${o.descripcion.slice(0, 80)}`,
          detalle: o.acciones ?? null,
          estado: 'abierta',
          cerrada_at: null,
        });
      }
      return { ...d, observaciones: [obs, ...d.observaciones], alertas };
    });
  }, []);

  const eliminarObservacion = useCallback((id: string) => {
    setDb((d) => ({
      ...d,
      observaciones: d.observaciones.filter((o) => o.id !== id),
    }));
  }, []);

  const agregarCheckin = useCallback((c: NuevoCheckin) => {
    const nuevo: CheckinAnimo = {
      id: uid(),
      created_at: ahora(),
      nino_id: c.nino_id,
      fecha: c.fecha,
      animo: c.animo,
      nota: c.nota ?? null,
    };
    setDb((d) => ({ ...d, checkins: [nuevo, ...d.checkins] }));
  }, []);

  const agregarAlerta = useCallback((a: NuevaAlerta) => {
    const nueva: Alerta = {
      id: uid(),
      created_at: ahora(),
      nino_id: a.nino_id,
      observacion_id: a.observacion_id ?? null,
      titulo: a.titulo,
      detalle: a.detalle ?? null,
      estado: 'abierta',
      cerrada_at: null,
    };
    setDb((d) => ({ ...d, alertas: [nueva, ...d.alertas] }));
  }, []);

  const cambiarEstadoAlerta = useCallback(
    (id: string, estado: EstadoAlerta) => {
      setDb((d) => ({
        ...d,
        alertas: d.alertas.map((a) =>
          a.id === id
            ? {
                ...a,
                estado,
                cerrada_at: estado === 'cerrada' ? ahora() : null,
              }
            : a,
        ),
      }));
    },
    [],
  );

  const agregarSeguimiento = useCallback((s: NuevoSeguimiento) => {
    const nuevo: Seguimiento = {
      id: uid(),
      created_at: ahora(),
      nino_id: s.nino_id,
      fecha: s.fecha,
      medio: s.medio,
      resumen: s.resumen,
      acuerdos: s.acuerdos ?? null,
      estado: s.estado,
    };
    setDb((d) => ({ ...d, seguimientos: [nuevo, ...d.seguimientos] }));
  }, []);

  const cambiarEstadoSeguimiento = useCallback(
    (id: string, estado: EstadoSeguimiento) => {
      setDb((d) => ({
        ...d,
        seguimientos: d.seguimientos.map((s) =>
          s.id === id ? { ...s, estado } : s,
        ),
      }));
    },
    [],
  );

  const cargarEjemplo = useCallback(() => setDb(datosEjemplo()), []);
  const limpiarTodo = useCallback(() => setDb(VACIA), []);
  const exportar = useCallback(() => JSON.stringify(db, null, 2), [db]);
  const importar = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      setDb({ ...VACIA, ...parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      db,
      cargado,
      agregarNino,
      actualizarNino,
      eliminarNino,
      agregarObservacion,
      eliminarObservacion,
      agregarCheckin,
      agregarAlerta,
      cambiarEstadoAlerta,
      agregarSeguimiento,
      cambiarEstadoSeguimiento,
      cargarEjemplo,
      limpiarTodo,
      exportar,
      importar,
    }),
    [
      db,
      cargado,
      agregarNino,
      actualizarNino,
      eliminarNino,
      agregarObservacion,
      eliminarObservacion,
      agregarCheckin,
      agregarAlerta,
      cambiarEstadoAlerta,
      agregarSeguimiento,
      cambiarEstadoSeguimiento,
      cargarEjemplo,
      limpiarTodo,
      exportar,
      importar,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}

// Selectores de conveniencia -------------------------------------------------
export function obsDeNino(db: BaseDatos, ninoId: string): Observacion[] {
  return db.observaciones
    .filter((o) => o.nino_id === ninoId)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}
export function checkinsDeNino(db: BaseDatos, ninoId: string): CheckinAnimo[] {
  return db.checkins
    .filter((c) => c.nino_id === ninoId)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}
export function alertasDeNino(db: BaseDatos, ninoId: string): Alerta[] {
  return db.alertas.filter((a) => a.nino_id === ninoId);
}
export function seguimientosDeNino(
  db: BaseDatos,
  ninoId: string,
): Seguimiento[] {
  return db.seguimientos
    .filter((s) => s.nino_id === ninoId)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

// Datos de ejemplo (tema safari) --------------------------------------------
function diasAtras(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function datosEjemplo(): BaseDatos {
  const ninos: Nino[] = [
    {
      id: 'ej-1',
      nombre: 'Mateo Ramírez',
      animal: '🦁',
      fecha_nacimiento: '2017-04-12',
      grupo: GRUPOS_SUGERIDOS[0],
      tutor_nombre: 'Laura Ramírez',
      tutor_contacto: '55-1234-5678',
      alergias: 'Ninguna conocida',
      notas: 'Le encantan los dinosaurios y construir con bloques.',
      activo: true,
      created_at: ahora(),
    },
    {
      id: 'ej-2',
      nombre: 'Valentina Cruz',
      animal: '🦒',
      fecha_nacimiento: '2018-09-30',
      grupo: GRUPOS_SUGERIDOS[3],
      tutor_nombre: 'Diego Cruz',
      tutor_contacto: 'diego.cruz@correo.com',
      alergias: 'Alergia leve al polen',
      notas: 'Muy creativa; a veces le cuesta despedirse por las mañanas.',
      activo: true,
      created_at: ahora(),
    },
    {
      id: 'ej-3',
      nombre: 'Emiliano Soto',
      animal: '🐘',
      fecha_nacimiento: '2016-12-05',
      grupo: GRUPOS_SUGERIDOS[2],
      tutor_nombre: 'Ana Soto',
      tutor_contacto: '55-8765-4321',
      alergias: null,
      notas: 'Líder natural en los juegos de equipo.',
      activo: true,
      created_at: ahora(),
    },
  ];

  const observaciones: Observacion[] = [
    {
      id: 'eo-1',
      nino_id: 'ej-1',
      fecha: diasAtras(1),
      categoria: 'social',
      semaforo: 'verde',
      descripcion: 'Invitó a un compañero nuevo a unirse a su juego de safari.',
      acciones: 'Se reconoció su gesto frente al grupo.',
      created_at: ahora(),
    },
    {
      id: 'eo-2',
      nino_id: 'ej-2',
      fecha: diasAtras(2),
      categoria: 'emocional',
      semaforo: 'amarillo',
      descripcion:
        'Lloró al llegar y tardó en integrarse a la primera actividad.',
      acciones: 'Acompañamiento cercano; eligió la canción de bienvenida.',
      created_at: ahora(),
    },
    {
      id: 'eo-3',
      nino_id: 'ej-3',
      fecha: diasAtras(1),
      categoria: 'fortalezas',
      semaforo: 'verde',
      descripcion: 'Organizó a su equipo para una búsqueda del tesoro animal.',
      acciones: null,
      created_at: ahora(),
    },
  ];

  const checkins: CheckinAnimo[] = [
    { id: 'ec-1', nino_id: 'ej-1', fecha: diasAtras(0), animo: 5, nota: null, created_at: ahora() },
    { id: 'ec-2', nino_id: 'ej-2', fecha: diasAtras(0), animo: 3, nota: 'Mañana difícil', created_at: ahora() },
    { id: 'ec-3', nino_id: 'ej-3', fecha: diasAtras(0), animo: 4, nota: null, created_at: ahora() },
  ];

  const seguimientos: Seguimiento[] = [
    {
      id: 'es-1',
      nino_id: 'ej-2',
      fecha: diasAtras(2),
      medio: 'presencial' as MedioContacto,
      resumen: 'Se comentó a su papá la dificultad en las despedidas.',
      acuerdos: 'Probar una rutina de despedida corta y un objeto de casa.',
      estado: 'realizado',
      created_at: ahora(),
    },
  ];

  return { ninos, observaciones, checkins, alertas: [], seguimientos };
}
