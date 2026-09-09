import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { exigirAutor } from "@/lib/auth";
import { revalidarContenido } from "@/lib/revalidar";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase.from("config").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const config: Record<string, string> = {};
  for (const fila of data) config[fila.clave] = fila.valor;
  return NextResponse.json({ config });
}

export async function PUT(req: NextRequest) {
  const autor = await exigirAutor();
  if (!autor.ok) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const cambios: Record<string, string> = await req.json();

  const filas = Object.entries(cambios).map(([clave, valor]) => ({
    clave,
    valor,
  }));

  const { error } = await autor.supabase.from("config").upsert(filas);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidarContenido();
  return NextResponse.json({ ok: true });
}
