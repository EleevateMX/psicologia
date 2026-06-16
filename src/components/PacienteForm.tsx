'use client';

import type { Nino } from '@/lib/dominio';

interface Props {
  action: (form: FormData) => void | Promise<void>;
  inicial?: Partial<Nino>;
}

export function PacienteForm({ action, inicial }: Props) {
  return (
    <form
      action={action}
      className="space-y-5"
    >
      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Datos personales
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="pac_nombre">
              Nombre completo *
            </label>
            <input
              id="pac_nombre"
              name="nombre"
              required
              className="input"
              defaultValue={inicial?.nombre ?? ''}
              placeholder="Nombre de la persona"
            />
          </div>
          <div>
            <label className="label" htmlFor="pac_nac">
              Fecha de nacimiento
            </label>
            <input
              id="pac_nac"
              name="fecha_nacimiento"
              type="date"
              className="input"
              defaultValue={inicial?.fecha_nacimiento ?? ''}
            />
          </div>
          <div>
            <label className="label" htmlFor="pac_ocup">
              Ocupación
            </label>
            <input
              id="pac_ocup"
              name="ocupacion"
              className="input"
              defaultValue={inicial?.ocupacion ?? ''}
              placeholder="Estudiante, empleado/a, ..."
            />
          </div>
          <div>
            <label className="label" htmlFor="pac_tel">
              Teléfono
            </label>
            <input
              id="pac_tel"
              name="telefono"
              type="tel"
              className="input"
              defaultValue={inicial?.telefono ?? ''}
              placeholder="55-0000-0000"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="pac_correo">
              Correo electrónico
            </label>
            <input
              id="pac_correo"
              name="correo"
              type="email"
              className="input"
              defaultValue={inicial?.correo ?? ''}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Información clínica
        </legend>
        <div>
          <label className="label" htmlFor="pac_motivo">
            Motivo de consulta
          </label>
          <textarea
            id="pac_motivo"
            name="motivo_consulta"
            rows={3}
            className="input"
            defaultValue={inicial?.motivo_consulta ?? ''}
            placeholder="¿Qué le trae al proceso? Razón principal que expresa la persona…"
          />
        </div>
        <div>
          <label className="label" htmlFor="pac_ant">
            Antecedentes relevantes
          </label>
          <textarea
            id="pac_ant"
            name="antecedentes"
            rows={3}
            className="input"
            defaultValue={inicial?.antecedentes ?? ''}
            placeholder="Historia de vida relevante, salud, procesos anteriores…"
          />
        </div>
        <div>
          <label className="label" htmlFor="pac_plan">
            Plan de trabajo / objetivos
          </label>
          <textarea
            id="pac_plan"
            name="plan_trabajo"
            rows={3}
            className="input"
            defaultValue={inicial?.plan_trabajo ?? ''}
            placeholder="Metas del proceso, enfoque, acuerdos iniciales…"
          />
        </div>
        <div>
          <label className="label" htmlFor="pac_notas">
            Notas adicionales
          </label>
          <textarea
            id="pac_notas"
            name="notas"
            rows={2}
            className="input"
            defaultValue={inicial?.notas ?? ''}
            placeholder="Cualquier dato relevante que no encaje en otro campo…"
          />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            name="activo"
            type="checkbox"
            defaultChecked={inicial?.activo ?? true}
            className="rounded border-slate-300"
          />
          Expediente activo
        </label>
      </div>

      <button type="submit" className="btn-primary">
        Guardar expediente
      </button>
    </form>
  );
}
