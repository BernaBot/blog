import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { exigirAutor } from "@/lib/auth";
import { revalidarContenido } from "@/lib/revalidar";

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get("categoria");
  const busqueda = searchParams.get("q");
  const supabase = createSupabaseServer();

  let query = supabase
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

export async function POST(req: NextRequest) {
  const autor = await exigirAutor();
  if (!autor.ok) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cuerpo = await req.json();
  const slugBase = slugify(cuerpo.titulo || "entrada");
  let slug = slugBase;
  let intento = 1;

  while (true) {
    const { data } = await autor.supabase
      .from("entradas")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) break;
    intento += 1;
    slug = `${slugBase}-${intento}`;
  }

  const { data, error } = await autor.supabase
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
  revalidarContenido(data?.slug);
  return NextResponse.json({ entrada: data });
}
