import { NextRequest, NextResponse } from "next/server";
import { supabasePublico } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { haySesionValida } from "@/lib/auth";
import { revalidarContenido } from "@/lib/revalidar";

export const dynamic = "force-dynamic";

// GET /api/config -> devuelve clave/valor (índice, biografía, bajada, título)
export async function GET() {
  const { data, error } = await supabasePublico.from("config").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const config: Record<string, string> = {};
  for (const fila of data) config[fila.clave] = fila.valor;
  return NextResponse.json({ config });
}

// PUT /api/config -> actualiza una o varias claves (requiere sesión)
export async function PUT(req: NextRequest) {
  if (!(await haySesionValida())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const cambios: Record<string, string> = await req.json();

  const filas = Object.entries(cambios).map(([clave, valor]) => ({
    clave,
    valor,
  }));

  const { error } = await supabaseAdmin.from("config").upsert(filas);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidarContenido();
  return NextResponse.json({ ok: true });
}
