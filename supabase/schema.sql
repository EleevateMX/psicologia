-- ============================================================================
-- Bitácora de Verano — Esquema de base de datos (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- App de un solo usuario (monitor). Cada fila pertenece al usuario autenticado
-- (owner_id = auth.uid()) y las políticas RLS impiden ver datos de otros.
--
-- Cómo aplicarlo:
--   Supabase Dashboard → SQL Editor → pega este archivo → Run.
-- ============================================================================

-- Tipos enumerados -----------------------------------------------------------
do $$ begin
  create type semaforo_t as enum ('verde', 'amarillo', 'rojo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type categoria_t as enum ('conducta', 'emocional', 'social', 'salud', 'fortalezas');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_alerta_t as enum ('abierta', 'en_seguimiento', 'cerrada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_seguimiento_t as enum ('pendiente', 'realizado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type medio_contacto_t as enum ('presencial', 'telefono', 'mensaje', 'correo', 'otro');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Tabla: ninos (fichas de niñas y niños)
-- ----------------------------------------------------------------------------
create table if not exists public.ninos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null,
  fecha_nacimiento date,
  grupo text,
  tutor_nombre text,
  tutor_contacto text,
  alergias text,
  notas text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Tabla: observaciones
-- ----------------------------------------------------------------------------
create table if not exists public.observaciones (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nino_id uuid not null references public.ninos(id) on delete cascade,
  fecha date not null default current_date,
  categoria categoria_t not null,
  semaforo semaforo_t not null default 'verde',
  descripcion text not null,
  acciones text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Tabla: checkins_animo (check-in de ánimo)
-- ----------------------------------------------------------------------------
create table if not exists public.checkins_animo (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nino_id uuid not null references public.ninos(id) on delete cascade,
  fecha date not null default current_date,
  animo smallint not null check (animo between 1 and 5),
  nota text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Tabla: alertas
-- ----------------------------------------------------------------------------
create table if not exists public.alertas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nino_id uuid not null references public.ninos(id) on delete cascade,
  observacion_id uuid references public.observaciones(id) on delete set null,
  titulo text not null,
  detalle text,
  estado estado_alerta_t not null default 'abierta',
  created_at timestamptz not null default now(),
  cerrada_at timestamptz
);

-- ----------------------------------------------------------------------------
-- Tabla: seguimientos (con tutores)
-- ----------------------------------------------------------------------------
create table if not exists public.seguimientos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nino_id uuid not null references public.ninos(id) on delete cascade,
  fecha date not null default current_date,
  medio medio_contacto_t not null default 'presencial',
  resumen text not null,
  acuerdos text,
  estado estado_seguimiento_t not null default 'pendiente',
  created_at timestamptz not null default now()
);

-- Índices --------------------------------------------------------------------
create index if not exists idx_observaciones_nino on public.observaciones(nino_id);
create index if not exists idx_checkins_nino on public.checkins_animo(nino_id);
create index if not exists idx_alertas_nino on public.alertas(nino_id);
create index if not exists idx_seguimientos_nino on public.seguimientos(nino_id);

-- ============================================================================
-- Row Level Security: cada usuario sólo ve y edita sus propios registros.
-- ============================================================================
alter table public.ninos          enable row level security;
alter table public.observaciones  enable row level security;
alter table public.checkins_animo enable row level security;
alter table public.alertas        enable row level security;
alter table public.seguimientos   enable row level security;

do $$
declare t text;
begin
  foreach t in array array['ninos','observaciones','checkins_animo','alertas','seguimientos']
  loop
    execute format('drop policy if exists %I_sel on public.%I;', t, t);
    execute format('drop policy if exists %I_ins on public.%I;', t, t);
    execute format('drop policy if exists %I_upd on public.%I;', t, t);
    execute format('drop policy if exists %I_del on public.%I;', t, t);

    execute format(
      'create policy %I_sel on public.%I for select using (owner_id = auth.uid());', t, t);
    execute format(
      'create policy %I_ins on public.%I for insert with check (owner_id = auth.uid());', t, t);
    execute format(
      'create policy %I_upd on public.%I for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());', t, t);
    execute format(
      'create policy %I_del on public.%I for delete using (owner_id = auth.uid());', t, t);
  end loop;
end $$;
