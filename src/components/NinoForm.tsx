import Link from 'next/link';
import type { Nino } from '@/lib/dominio';

/** Formulario de ficha (alta/edición). Usa Server Actions vía la prop action. */
export function NinoForm({
  action,
  nino,
  esEdicion,
}: {
  action: (form: FormData) => void;
  nino?: Nino;
  esEdicion?: boolean;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="nombre">
            Nombre de la niña o niño *
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            className="input"
            defaultValue={nino?.nombre ?? ''}
            placeholder="Nombre y apellidos"
          />
        </div>

        <div>
          <label className="label" htmlFor="fecha_nacimiento">
            Fecha de nacimiento
          </label>
          <input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            className="input"
            defaultValue={nino?.fecha_nacimiento ?? ''}
          />
        </div>
        <div>
          <label className="label" htmlFor="grupo">
            Grupo / equipo
          </label>
          <input
            id="grupo"
            name="grupo"
            className="input"
            defaultValue={nino?.grupo ?? ''}
            placeholder="Ej. Exploradores"
          />
        </div>

        <div>
          <label className="label" htmlFor="tutor_nombre">
            Tutora o tutor
          </label>
          <input
            id="tutor_nombre"
            name="tutor_nombre"
            className="input"
            defaultValue={nino?.tutor_nombre ?? ''}
          />
        </div>
        <div>
          <label className="label" htmlFor="tutor_contacto">
            Contacto del tutor
          </label>
          <input
            id="tutor_contacto"
            name="tutor_contacto"
            className="input"
            defaultValue={nino?.tutor_contacto ?? ''}
            placeholder="Teléfono o correo"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="alergias">
            Alergias / consideraciones de salud
          </label>
          <input
            id="alergias"
            name="alergias"
            className="input"
            defaultValue={nino?.alergias ?? ''}
            placeholder="Ej. alergia a frutos secos"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="notas">
            Notas generales
          </label>
          <textarea
            id="notas"
            name="notas"
            rows={3}
            className="input"
            defaultValue={nino?.notas ?? ''}
            placeholder="Intereses, contexto, lo que conviene recordar…"
          />
        </div>

        {esEdicion && (
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={nino?.activo ?? true}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              Activo en el curso (desmarca para archivar)
            </span>
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {esEdicion ? 'Guardar cambios' : 'Crear ficha'}
        </button>
        <Link
          href={esEdicion && nino ? `/ninos/${nino.id}` : '/ninos'}
          className="btn-secondary"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
