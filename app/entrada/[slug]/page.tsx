import { notFound } from "next/navigation";
import Link from "next/link";
import { supabasePublico } from "@/lib/supabase";
import { renderContenido } from "@/lib/markdown";
import Header from "@/components/Header";
import Embed from "@/components/Embed";
import type { Entrada } from "@/lib/types";

export const revalidate = 0;

async function obtenerConfig() {
  const { data } = await supabasePublico.from("config").select("*");
  const config: Record<string, string> = {};
  (data ?? []).forEach((f) => (config[f.clave] = f.valor));
  return config;
}

export default async function EntradaPage({
  params,
}: {
  params: { slug: string };
}) {
  const config = await obtenerConfig();
  const { data: entrada } = await supabasePublico
    .from("entradas")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!entrada) notFound();
  const e = entrada as Entrada;

  return (
    <main>
      <Header
        titulo={config.titulo_sitio || "Apatía mental"}
        bajada={config.bajada || "escritos desde la cama"}
      />
      <article className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="font-clinico text-xs text-tinta/50 hover:text-salida">
          ← volver al índice
        </Link>

        <h1 className="mt-4 font-display text-3xl text-tinta sm:text-4xl">
          {e.titulo}
        </h1>
        <p className="mt-2 font-clinico text-xs text-tinta/50">
          {new Date(e.creado_en).toLocaleDateString("es-AR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {e.categorias?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {e.categorias.map((cat) => (
              <Link
                key={cat}
                href={`/?categoria=${encodeURIComponent(cat)}`}
                className="font-clinico text-[11px] text-zocalo-oscuro hover:text-salida"
              >
                #{cat}
              </Link>
            ))}
          </div>
        )}

        <div
          className="prosa-entrada mt-8"
          dangerouslySetInnerHTML={{ __html: renderContenido(e.contenido) }}
        />

        {e.medios?.length > 0 && (
          <div className="mt-8 border-t border-zocalo/30 pt-6">
            {e.medios.map((m, i) => (
              <Embed key={i} medio={m} />
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
