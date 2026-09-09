import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Entrada } from "@/lib/types";
import CerrarSesionBoton from "./CerrarSesionBoton";
import EditorConfig from "./EditorConfig";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Panel() {
  const { data } = await supabaseAdmin
    .from("entradas")
    .select("*")
    .order("creado_en", { ascending: false });

  const entradas = (data ?? []) as Entrada[];

  return (
    <main className="min-h-screen bg-yeso">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-clinico text-xs text-tinta/50">PANEL — elAutor</p>
            <h1 className="font-display text-3xl text-tinta">Escritorio</h1>
          </div>
          <CerrarSesionBoton />
        </div>

        <div className="mb-8 flex gap-3">
          <Link
            href="/panel/nueva"
            className="bg-zocalo-oscuro px-4 py-2 font-clinico text-sm text-yeso hover:bg-salida"
          >
            + nueva entrada
          </Link>
          <Link
            href="/"
            className="px-4 py-2 font-clinico text-sm text-tinta/60 hover:text-tinta"
          >
            ver sitio
          </Link>
        </div>

        <EditorConfig />

        <h2 className="mb-3 mt-10 font-clinico text-xs text-tinta/50">
          ENTRADAS ({entradas.length})
        </h2>
        <div className="divide-y divide-zocalo/30 border-t border-zocalo/30">
          {entradas.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-texto text-lg text-tinta">
                  {e.titulo}{" "}
                  {!e.publicado && (
                    <span className="font-clinico text-[10px] text-expediente">
                      borrador
                    </span>
                  )}
                </p>
                <p className="font-clinico text-[11px] text-tinta/40">
                  /{e.slug} · {e.categorias.join(", ") || "sin categorías"}
                </p>
              </div>
              <div className="flex gap-3 font-clinico text-xs">
                <Link href={`/panel/editar/${e.id}`} className="text-salida hover:underline">
                  editar
                </Link>
                <Link href={`/entrada/${e.slug}`} className="text-tinta/50 hover:underline">
                  ver
                </Link>
              </div>
            </div>
          ))}
          {entradas.length === 0 && (
            <p className="py-6 font-clinico text-sm text-tinta/50">
              todavía no escribiste nada.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
