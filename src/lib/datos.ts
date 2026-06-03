import { createClient } from '@/lib/supabase/server';
import type {
  Nino,
  Observacion,
  CheckinAnimo,
  Alerta,
  Seguimiento,
} from '@/lib/dominio';

export async function getNinos(soloActivos = false): Promise<Nino[]> {
  const supabase = await createClient();
  let q = supabase.from('ninos').select('*').order('nombre');
  if (soloActivos) q = q.eq('activo', true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getNino(id: string): Promise<Nino | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('ninos').select('*').eq('id', id).single();
  return data ?? null;
}

export async function getObservaciones(ninoId: string): Promise<Observacion[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('observaciones')
    .select('*')
    .eq('nino_id', ninoId)
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getCheckins(ninoId: string): Promise<CheckinAnimo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('checkins_animo')
    .select('*')
    .eq('nino_id', ninoId)
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getSeguimientosDeNino(
  ninoId: string,
): Promise<Seguimiento[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('seguimientos')
    .select('*')
    .eq('nino_id', ninoId)
    .order('fecha', { ascending: false });
  return data ?? [];
}

export async function getAlertasDeNino(ninoId: string): Promise<Alerta[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('alertas')
    .select('*')
    .eq('nino_id', ninoId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export interface AlertaConNino extends Alerta {
  nino_nombre: string;
}

export async function getAlertas(): Promise<AlertaConNino[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('alertas')
    .select('*, ninos(nombre)')
    .order('created_at', { ascending: false });
  return (data ?? []).map((a: any) => ({
    ...a,
    nino_nombre: a.ninos?.nombre ?? 'Niño',
  }));
}

export interface SeguimientoConNino extends Seguimiento {
  nino_nombre: string;
}

export async function getSeguimientos(): Promise<SeguimientoConNino[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('seguimientos')
    .select('*, ninos(nombre)')
    .order('fecha', { ascending: false });
  return (data ?? []).map((s: any) => ({
    ...s,
    nino_nombre: s.ninos?.nombre ?? 'Niño',
  }));
}
