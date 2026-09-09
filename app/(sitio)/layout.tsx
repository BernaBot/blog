import { Suspense } from "react";
import { supabasePublico } from "@/lib/supabase";
import SitioCliente from "@/components/SitioCliente";
import type { Entrada } from "@/lib/types";
import { ordenarEntradas } from "@/lib/entradas";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

async function obtenerConfig() {
  const { data } = await supabasePublico.from("config").select("*");
  const config: Record<string, string> = {};
  (data ?? []).forEach((f) => (config[f.clave] = f.valor));
  return config;
}

export default async function SitioLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  const config = await obtenerConfig();
  const { data } = await supabasePublico
    .from("entradas")
    .select("*")
    .order("creado_en", { ascending: false });
  const entradas = ordenarEntradas((data ?? []) as Entrada[]);

  return (
    <Suspense fallback={null}>
      <SitioCliente
        titulo={config.titulo_sitio || "Apatía mental"}
        bajada={config.bajada || "escritos desde la cama"}
        biografia={config.biografia}
        entradas={entradas}
      />
    </Suspense>
  );
}
