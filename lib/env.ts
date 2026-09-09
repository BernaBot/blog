function texto(valor: string | undefined) {
  return valor?.trim() || "";
}

export function supabaseUrl() {
  const url =
    texto(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    texto(process.env.SUPABASE_URL);
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add it in Vercel → Settings → Environment Variables, and in .env.local for local dev."
    );
  }
  return url;
}

export function supabaseAnonKey() {
  const key =
    texto(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    texto(process.env.SUPABASE_ANON_KEY) ||
    texto(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    texto(process.env.SUPABASE_PUBLISHABLE_KEY);
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it in Vercel → Settings → Environment Variables, and in .env.local for local dev."
    );
  }
  return key;
}
