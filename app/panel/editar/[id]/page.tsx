import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import PanelForm from "@/components/PanelForm";
import type { Entrada } from "@/lib/types";
import BotonEliminar from "./BotonEliminar";

export default async function EditarEntrada({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await supabaseAdmin
    .from("entradas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) notFound();
  const entrada = data as Entrada;

  return (
    <main className="min-h-screen bg-yeso">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-clinico text-xs text-tinta/50">PANEL</p>
            <h1 className="font-display text-3xl text-tinta">Editar entrada</h1>
          </div>
          <BotonEliminar id={entrada.id} />
        </div>
        <PanelForm entrada={entrada} />
      </div>
    </main>
  );
}
