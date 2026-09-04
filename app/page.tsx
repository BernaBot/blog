import { supabasePublico } from "@/lib/supabase";
import Header from "@/components/Header";
import EntradaCard from "@/components/EntradaCard";
import type { Entrada } from "@/lib/types";

export const revalidate = 0;

async function obtenerConfig() {
  const { data } = await supabasePublico.from("config").select("*");
  const config: Record<string, string> = {};
  (data ?? []).forEach((f) => (config[f.clave] = f.valor));
  return config;
}

async function obtenerEntradas(categoria?: string, q?: string) {
  let query = supabasePublico
    .from("entradas")
    .select("*")
    .order("creado_en", { ascending: false });

  if (categoria) query = query.contains("categorias", [categoria]);
  if (q)
    query = query.or(
      `titulo.ilike.%${q}%,extracto.ilike.%${q}%,contenido.ilike.%${q}%`
    );

  const { data } = await query;
  return (data ?? []) as Entrada[];
}

export default async function Index({
  searchParams,
}: {
  searchParams: { categoria?: string; q?: string };
}) {
  const config = await obtenerConfig();
  const entradas = await obtenerEntradas(searchParams.categoria, searchParams.q);

  const todasCategorias = Array.from(
    new Set(entradas.flatMap((e) => e.categorias))
  ).sort();

  return (
    <main>
      <Header
        titulo={config.titulo_sitio || "Apatía mental"}
        bajada={config.bajada || "escritos desde la cama"}
      />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <form className="mb-6 flex gap-2" action="/">
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q}
            placeholder="buscar en el expediente..."
            className="flex-1 border border-zocalo/50 bg-yeso px-3 py-2 font-texto text-sm outline-none focus:border-salida"
          />
          <button
            type="submit"
            className="border border-zocalo-oscuro bg-zocalo-oscuro px-4 py-2 font-clinico text-xs text-yeso hover:bg-salida"
          >
            buscar
          </button>
        </form>

        {todasCategorias.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 border-b border-zocalo/30 pb-6 font-clinico text-xs">
            <a
              href="/"
              className={
                !searchParams.categoria
                  ? "text-salida"
                  : "text-tinta/50 hover:text-salida"
              }
            >
              todas
            </a>
            {todasCategorias.map((c) => (
              <a
                key={c}
                href={`/?categoria=${encodeURIComponent(c)}`}
                className={
                  searchParams.categoria === c
                    ? "text-salida"
                    : "text-tinta/50 hover:text-salida"
                }
              >
                #{c}
              </a>
            ))}
          </div>
        )}

        {entradas.length === 0 ? (
          <p className="font-clinico text-sm text-tinta/50">
            no hay entradas todavía.
          </p>
        ) : (
          entradas.map((e, i) => (
            <EntradaCard key={e.id} entrada={e} numero={entradas.length - i} />
          ))
        )}
      </div>
    </main>
  );
}
