import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/env";

// Cliente con la service role key: sólo se usa en rutas de API del
// servidor, nunca en el cliente. Ignora RLS, así que acá sí se ven
// y modifican los borradores (publicado = false).
let cliente: SupabaseClient | undefined;

export function getSupabaseAdmin() {
  if (!cliente) {
    cliente = createClient(supabaseUrl(), supabaseServiceRoleKey(), {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    });
  }
  return cliente;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const actual = getSupabaseAdmin();
    const valor = Reflect.get(actual, prop, actual);
    return typeof valor === "function" ? valor.bind(actual) : valor;
  },
});
