-- Run this in the Supabase SQL Editor (once per project).
-- Public site reads published entries; the panel uses the service role key.

create table if not exists public.config (
  clave text primary key,
  valor text not null default ''
);

create table if not exists public.entradas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  extracto text not null default '',
  contenido text not null default '',
  categorias text[] not null default '{}',
  medios jsonb not null default '[]',
  publicado boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists entradas_creado_en_idx on public.entradas (creado_en desc);
create index if not exists entradas_publicado_idx on public.entradas (publicado);

create or replace function public.set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists entradas_actualizado_en on public.entradas;
create trigger entradas_actualizado_en
before update on public.entradas
for each row execute function public.set_actualizado_en();

insert into public.config (clave, valor)
values
  ('titulo_sitio', 'Apatía mental'),
  ('bajada', 'escritos desde la cama'),
  ('biografia', '')
on conflict (clave) do nothing;

alter table public.config enable row level security;
alter table public.entradas enable row level security;

drop policy if exists "config publica de lectura" on public.config;
create policy "config publica de lectura"
on public.config for select
to anon, authenticated
using (true);

drop policy if exists "entradas publicadas de lectura" on public.entradas;
create policy "entradas publicadas de lectura"
on public.entradas for select
to anon, authenticated
using (publicado = true);
