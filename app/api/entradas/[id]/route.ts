import { NextRequest, NextResponse } from "next/server";
import { exigirAutor } from "@/lib/auth";
import { revalidarContenido } from "@/lib/revalidar";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const autor = await exigirAutor();
  if (!autor.ok) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cuerpo = await req.json();
  const { data: actual, error: errorLectura } = await autor.supabase
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

  const { data, error } = await autor.supabase
    .from("entradas")
    .update(parche)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidarContenido(data?.slug);
  return NextResponse.json({ entrada: data });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const autor = await exigirAutor();
  if (!autor.ok) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const cuerpo = await req.json();

  const { data, error } = await autor.supabase
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
  revalidarContenido(data.slug);
  return NextResponse.json({ entrada: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const autor = await exigirAutor();
  if (!autor.ok) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { data, error } = await autor.supabase
    .from("entradas")
    .delete()
    .eq("id", params.id)
    .select("slug")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidarContenido(data?.slug);
  return NextResponse.json({ ok: true });
}
