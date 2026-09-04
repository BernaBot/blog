import { supabasePublico } from "@/lib/supabase";
import Header from "@/components/Header";

export const revalidate = 0;

export default async function Biografia() {
  const { data } = await supabasePublico.from("config").select("*");
  const config: Record<string, string> = {};
  (data ?? []).forEach((f) => (config[f.clave] = f.valor));

  return (
    <main>
      <Header
        titulo={config.titulo_sitio || "Apatía mental"}
        bajada={config.bajada || "escritos desde la cama"}
      />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="mb-6 font-clinico text-xs text-tinta/50">
          FICHA DEL PACIENTE
        </p>
        <div className="prosa-entrada whitespace-pre-line">
          {config.biografia || "Todavía no hay biografía cargada."}
        </div>
      </div>
    </main>
  );
}
