/** Helpers para leer valores de un FormData de manera segura. */

export function txt(form: FormData, k: string): string {
  return String(form.get(k) ?? '').trim();
}

export function txtOrNull(form: FormData, k: string): string | null {
  const v = txt(form, k);
  return v === '' ? null : v;
}
