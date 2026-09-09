import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { haySesionValida } from "@/lib/auth";
import { revalidarContenido } from "@/lib/revalidar";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await haySesionValida())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cuerpo = await req.json();
  const { data: actual, error: errorLectura } = await supabaseAdmin
    .from("entradas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (errorLectura || !actual) {
    return NextResponse.json({ error: "No encontrada." }, { status: 404 });
  }

  const categorias = new Set<string>(actual.categorias ?? []);
  if (typeof cuerpo.arriba === "boolean") {
    if (cuerpo.arriba) categorias.add("arriba");
    else categorias.delete("arriba");
  }

  const parche: Record<string, unknown> = {};
  if (typeof cuerpo.publicado === "boolean") parche.publicado = cuerpo.publicado;
  if (typeof cuerpo.arriba === "boolean") parche.categorias = [...categorias];

  const { data, error } = await supabaseAdmin
    .from("entradas")
    .update(parche)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidarContenido(data?.slug, params.id);
  return NextResponse.json({ entrada: data });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await haySesionValida())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const cuerpo = await req.json();

  const { data, error } = await supabaseAdmin
    .from("entradas")
    .update({
      titulo: cuerpo.titulo,
      extracto: cuerpo.extracto ?? "",
      contenido: cuerpo.contenido ?? "",
      categorias: cuerpo.categorias ?? [],
      medios: cuerpo.medios ?? [],
      publicado: cuerpo.publicado ?? true,
      ...(cuerpo.slug ? { slug: cuerpo.slug } : {}),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "No encontrada." }, { status: 404 });
  }
  revalidarContenido(data.slug, params.id);
  return NextResponse.json({ entrada: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await haySesionValida())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("entradas")
    .delete()
    .eq("id", params.id)
    .select("slug")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidarContenido(data?.slug, params.id);
  return NextResponse.json({ ok: true });
}
