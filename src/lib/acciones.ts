'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type {
  Categoria,
  EstadoAlerta,
  EstadoSeguimiento,
  MedioContacto,
  Semaforo,
} from '@/lib/dominio';

function txt(form: FormData, k: string): string {
  return String(form.get(k) ?? '').trim();
}
function txtOrNull(form: FormData, k: string): string | null {
  const v = txt(form, k);
  return v === '' ? null : v;
}

// --- Niños ------------------------------------------------------------------

export async function crearNino(form: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ninos')
    .insert({
      nombre: txt(form, 'nombre'),
      fecha_nacimiento: txtOrNull(form, 'fecha_nacimiento'),
      grupo: txtOrNull(form, 'grupo'),
      tutor_nombre: txtOrNull(form, 'tutor_nombre'),
      tutor_contacto: txtOrNull(form, 'tutor_contacto'),
      alergias: txtOrNull(form, 'alergias'),
      notas: txtOrNull(form, 'notas'),
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  revalidatePath('/ninos');
  redirect(`/ninos/${data.id}`);
}

export async function actualizarNino(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ninos')
    .update({
      nombre: txt(form, 'nombre'),
      fecha_nacimiento: txtOrNull(form, 'fecha_nacimiento'),
      grupo: txtOrNull(form, 'grupo'),
      tutor_nombre: txtOrNull(form, 'tutor_nombre'),
      tutor_contacto: txtOrNull(form, 'tutor_contacto'),
      alergias: txtOrNull(form, 'alergias'),
      notas: txtOrNull(form, 'notas'),
      activo: form.get('activo') === 'on',
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/ninos/${id}`);
  revalidatePath('/ninos');
  redirect(`/ninos/${id}`);
}

export async function eliminarNino(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('ninos').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/ninos');
  redirect('/ninos');
}

// --- Observaciones ----------------------------------------------------------

export async function crearObservacion(ninoId: string, form: FormData) {
  const supabase = await createClient();
  const semaforo = txt(form, 'semaforo') as Semaforo;

  const { data, error } = await supabase
    .from('observaciones')
    .insert({
      nino_id: ninoId,
      fecha: txt(form, 'fecha'),
      categoria: txt(form, 'categoria') as Categoria,
      semaforo,
      descripcion: txt(form, 'descripcion'),
      acciones: txtOrNull(form, 'acciones'),
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  // Si la observación es roja y se solicitó, genera una alerta vinculada.
  if (semaforo === 'rojo' && form.get('crear_alerta') === 'on') {
    await supabase.from('alertas').insert({
      nino_id: ninoId,
      observacion_id: data.id,
      titulo: `Alerta: ${txt(form, 'descripcion').slice(0, 80)}`,
      detalle: txtOrNull(form, 'acciones'),
      estado: 'abierta',
    });
    revalidatePath('/alertas');
  }

  revalidatePath(`/ninos/${ninoId}`);
  revalidatePath('/');
}

export async function eliminarObservacion(id: string, ninoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('observaciones').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/ninos/${ninoId}`);
}

// --- Check-in de ánimo ------------------------------------------------------

export async function crearCheckin(ninoId: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('checkins_animo').insert({
    nino_id: ninoId,
    fecha: txt(form, 'fecha'),
    animo: Number(form.get('animo')),
    nota: txtOrNull(form, 'nota'),
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/ninos/${ninoId}`);
  revalidatePath('/');
}

// --- Alertas ----------------------------------------------------------------

export async function crearAlerta(ninoId: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('alertas').insert({
    nino_id: ninoId,
    titulo: txt(form, 'titulo'),
    detalle: txtOrNull(form, 'detalle'),
    estado: 'abierta',
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/ninos/${ninoId}`);
  revalidatePath('/alertas');
  revalidatePath('/');
}

export async function cambiarEstadoAlerta(id: string, estado: EstadoAlerta) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('alertas')
    .update({
      estado,
      cerrada_at: estado === 'cerrada' ? new Date().toISOString() : null,
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/alertas');
  revalidatePath('/');
}

// --- Seguimientos con tutores ----------------------------------------------

export async function crearSeguimiento(ninoId: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('seguimientos').insert({
    nino_id: ninoId,
    fecha: txt(form, 'fecha'),
    medio: txt(form, 'medio') as MedioContacto,
    resumen: txt(form, 'resumen'),
    acuerdos: txtOrNull(form, 'acuerdos'),
    estado: (txt(form, 'estado') as EstadoSeguimiento) || 'pendiente',
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/ninos/${ninoId}`);
  revalidatePath('/seguimientos');
}

export async function cambiarEstadoSeguimiento(
  id: string,
  estado: EstadoSeguimiento,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('seguimientos')
    .update({ estado })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/seguimientos');
}
