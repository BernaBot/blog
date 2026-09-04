import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { haySesionValida } from "@/lib/auth";

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
  return NextResponse.json({ entrada: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await haySesionValida())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { error } = await supabaseAdmin
    .from("entradas")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
