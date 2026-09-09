import { createSupabaseServer } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function obtenerUsuario() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function esAutor(supabase: SupabaseClient, user: User | null) {
  if (!user) return false;
  const { data } = await supabase
    .from("autores")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return Boolean(data);
}

export async function exigirAutor() {
  const { supabase, user } = await obtenerUsuario();
  if (!user || !(await esAutor(supabase, user))) {
    return { supabase: null, user: null, ok: false as const };
  }
  return { supabase, user, ok: true as const };
}
