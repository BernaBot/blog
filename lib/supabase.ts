import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

// Cliente público (anon key). Respeta las políticas de RLS:
// sólo devuelve entradas con publicado = true.
// Lazy: Next.js imports this module during `next build` and must not
// construct the client until a request actually needs it.
let cliente: SupabaseClient | undefined;

export function getSupabasePublico() {
  if (!cliente) {
    cliente = createClient(supabaseUrl(), supabaseAnonKey());
  }
  return cliente;
}

export const supabasePublico = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const actual = getSupabasePublico();
    const valor = Reflect.get(actual, prop, actual);
    return typeof valor === "function" ? valor.bind(actual) : valor;
  },
});
