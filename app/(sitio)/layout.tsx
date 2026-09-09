import { Suspense } from "react";
import SitioCliente from "@/components/SitioCliente";
import type { Entrada } from "@/lib/types";
import { ordenarEntradas } from "@/lib/entradas";
import { esAutor, obtenerUsuario } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SitioLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await obtenerUsuario();
  const autor = await esAutor(supabase, user);

  const [{ data: filasConfig }, { data: filasEntradas }] = await Promise.all([
    supabase.from("config").select("*"),
    supabase.from("entradas").select("*").order("creado_en", { ascending: false }),
  ]);

  const config: Record<string, string> = {};
  (filasConfig ?? []).forEach((f) => (config[f.clave] = f.valor));
  const entradas = ordenarEntradas((filasEntradas ?? []) as Entrada[]);

  return (
    <Suspense fallback={null}>
      <SitioCliente
        titulo={config.titulo_sitio || "Apatía mental"}
        bajada={config.bajada || "escritos desde la cama"}
        biografia={config.biografia}
        esAutor={autor}
        entradas={entradas}
      />
    </Suspense>
  );
}
