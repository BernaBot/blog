-- Apatía mental — autores + RLS
-- Pegá esto en Supabase → SQL Editor y ejecutalo.
--
-- Después:
-- 1. Authentication → Providers → Email: activá Email.
-- 2. Authentication → Providers → Email: DESACTIVÁ "Allow new users to sign up"
--    (si no, cualquiera podría registrarse).
-- 3. Authentication → Users → Add user: creá tu usuario (email + contraseña).
-- 4. Corré el INSERT de abajo con tu email (descomentá y cambiá la dirección).

create table if not exists public.autores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);

alter table public.autores enable row level security;

drop policy if exists "autores lectura propia" on public.autores;
create policy "autores lectura propia"
on public.autores for select
to authenticated
using (user_id = auth.uid());

create or replace function public.es_autor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.autores where user_id = auth.uid()
  );
$$;

revoke all on function public.es_autor() from public;
grant execute on function public.es_autor() to anon, authenticated;

drop policy if exists "entradas autor lectura total" on public.entradas;
create policy "entradas autor lectura total"
on public.entradas for select
to authenticated
using (public.es_autor());

drop policy if exists "entradas autor insertar" on public.entradas;
create policy "entradas autor insertar"
on public.entradas for insert
to authenticated
with check (public.es_autor());

drop policy if exists "entradas autor actualizar" on public.entradas;
create policy "entradas autor actualizar"
on public.entradas for update
to authenticated
using (public.es_autor())
with check (public.es_autor());

drop policy if exists "entradas autor borrar" on public.entradas;
create policy "entradas autor borrar"
on public.entradas for delete
to authenticated
using (public.es_autor());

drop policy if exists "config autor escribir" on public.config;
create policy "config autor escribir"
on public.config for insert
to authenticated
with check (public.es_autor());

drop policy if exists "config autor actualizar" on public.config;
create policy "config autor actualizar"
on public.config for update
to authenticated
using (public.es_autor())
with check (public.es_autor());

-- insert into public.autores (user_id)
-- select id from auth.users where email = 'tu@email.com';
