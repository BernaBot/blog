import { createClient } from "@supabase/supabase-js";

// Cliente público (anon key). Respeta las políticas de RLS:
// sólo devuelve entradas con publicado = true.
export const supabasePublico = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
