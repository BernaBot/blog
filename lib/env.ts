function primerValor(...nombres: string[]) {
  for (const nombre of nombres) {
    const valor = process.env[nombre]?.trim();
    if (valor) return valor;
  }
  throw new Error(
    `Missing ${nombres[0]}. Add it in Vercel → Settings → Environment Variables, and in .env.local for local dev.`
  );
}

export function supabaseUrl() {
  const url = primerValor("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
  if (!/^https?:\/\//i.test(url)) {
    const fallback = process.env.SUPABASE_URL?.trim();
    if (fallback && /^https?:\/\//i.test(fallback)) return fallback;
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid http(s) URL from Supabase → Project Settings → API."
    );
  }
  return url;
}

export function supabaseAnonKey() {
  return primerValor(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY"
  );
}

export function supabaseServiceRoleKey() {
  return primerValor("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY");
}
