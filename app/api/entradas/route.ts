import { NextRequest, NextResponse } from "next/server";
import { supabasePublico } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { haySesionValida } from "@/lib/auth";

export const dynamic = "force-dynamic";

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// GET /api/entradas            -> listado público (sólo publicadas)
// GET /api/entradas?todas=1    -> listado completo, requiere sesión (panel)
// GET /api/entradas?categoria=xyz -> filtra por categoría
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const todas = searchParams.get("todas") === "1";
  const categoria = searchParams.get("categoria");
  const busqueda = searchParams.get("q");

  const sesion = todas ? await haySesionValida() : false;
  const cliente = sesion ? supabaseAdmin : supabasePublico;

  let query = cliente
    .from("entradas")
    .select("*")
    .order("creado_en", { ascending: false });

  if (categoria) {
    query = query.contains("categorias", [categoria]);
  }
  if (busqueda) {
    query = query.or(
      `titulo.ilike.%${busqueda}%,extracto.ilike.%${busqueda}%,contenido.ilike.%${busqueda}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entradas: data });
}

// POST /api/entradas -> crea una entrada nueva (requiere sesión)
export async function POST(req: NextRequest) {
  if (!(await haySesionValida())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cuerpo = await req.json();
  const slugBase = slugify(cuerpo.titulo || "entrada");
  let slug = slugBase;
  let intento = 1;

  // evita choques de slug
  while (true) {
    const { data } = await supabaseAdmin
      .from("entradas")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) break;
    intento += 1;
    slug = `${slugBase}-${intento}`;
  }

  const { data, error } = await supabaseAdmin
    .from("entradas")
    .insert({
      slug,
      titulo: cuerpo.titulo,
      extracto: cuerpo.extracto ?? "",
      contenido: cuerpo.contenido ?? "",
      categorias: cuerpo.categorias ?? [],
      medios: cuerpo.medios ?? [],
      publicado: cuerpo.publicado ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entrada: data });
}
