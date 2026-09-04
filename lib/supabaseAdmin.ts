import { createClient } from "@supabase/supabase-js";

// Cliente con la service role key: sólo se usa en rutas de API del
// servidor, nunca en el cliente. Ignora RLS, así que acá sí se ven
// y modifican los borradores (publicado = false).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
