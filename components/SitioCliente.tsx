"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Buscador from "@/components/Buscador";
import VistaPuerta from "@/components/VistaPuerta";
import IrArriba from "@/components/IrArriba";
import AccesoOverlay from "@/components/AccesoOverlay";
import FichaOverlay from "@/components/FichaOverlay";
import PanelForm from "@/components/PanelForm";
import EditorSitio from "@/components/EditorSitio";
import { BusquedaProvider } from "@/components/Busqueda";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { EVENTO_ACCESO } from "@/lib/eventos";
import type { Entrada } from "@/lib/types";

type Edicion =
  | { tipo: "nueva" }
  | { tipo: "entrada"; entrada: Entrada }
  | { tipo: "sitio" }
  | null;

export default function SitioCliente({
  titulo,
  bajada,
  biografia,
  esAutor,
  entradas,
}: {
  titulo: string;
  bajada: string;
  biografia?: string;
  esAutor?: boolean;
  entradas: Entrada[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [acceso, setAcceso] = useState(false);
  const [edicion, setEdicion] = useState<Edicion>(null);

  useEffect(() => {
    const abrir = () => {
      if (!esAutor) setAcceso(true);
    };
    window.addEventListener(EVENTO_ACCESO, abrir);
    return () => window.removeEventListener(EVENTO_ACCESO, abrir);
  }, [esAutor]);

  useEffect(() => {
    const accesoQ = params.get("acceso") === "1";
    const nuevaQ = params.get("nueva") === "1";
    const id = params.get("editar");
    if (accesoQ && !esAutor) setAcceso(true);
    if (esAutor && nuevaQ) setEdicion({ tipo: "nueva" });
    if (esAutor && id) {
      const entrada = entradas.find((e) => e.id === id);
      if (entrada) setEdicion({ tipo: "entrada", entrada });
    }
    if (accesoQ || nuevaQ || id) {
      const siguiente = new URLSearchParams(params.toString());
      siguiente.delete("acceso");
      siguiente.delete("nueva");
      siguiente.delete("editar");
      const qs = siguiente.toString();
      router.replace(qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
    }
  }, [params, esAutor, entradas, router]);

  async function salir() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  }

  function cerrarEdicion() {
    setEdicion(null);
  }

  return (
    <BusquedaProvider>
      <main>
        <Header
          titulo={titulo}
          bajada={bajada}
          biografia={biografia}
          esAutor={esAutor}
          onNueva={() => setEdicion({ tipo: "nueva" })}
          onEditarSitio={() => setEdicion({ tipo: "sitio" })}
          onSalir={salir}
        >
          <Buscador />
        </Header>
        <div className="pasillo">
          <div className="pasillo-escena" aria-hidden="true">
            <div className="pasillo-foto" />
          </div>
          <div className="pasillo-umbral" aria-hidden="true" />
          <div className="puerta">
            <VistaPuerta
              entradas={entradas}
              esAutor={esAutor}
              onEditar={(entrada) => setEdicion({ tipo: "entrada", entrada })}
            />
            <IrArriba />
          </div>
        </div>
      </main>

      {acceso ? <AccesoOverlay onCerrar={() => setAcceso(false)} /> : null}

      {edicion?.tipo === "nueva" ? (
        <FichaOverlay titulo="Nueva entrada" ancha onCerrar={cerrarEdicion}>
          <PanelForm
            onCancelar={cerrarEdicion}
            onGuardado={(entrada) => {
              cerrarEdicion();
              if (entrada?.slug) router.push(`/entrada/${entrada.slug}`);
            }}
          />
        </FichaOverlay>
      ) : null}

      {edicion?.tipo === "entrada" ? (
        <FichaOverlay titulo="Editar entrada" ancha onCerrar={cerrarEdicion}>
          <PanelForm
            key={edicion.entrada.id}
            entrada={edicion.entrada}
            onCancelar={cerrarEdicion}
            onGuardado={(entrada) => {
              cerrarEdicion();
              if (entrada?.slug) router.push(`/entrada/${entrada.slug}`);
            }}
          />
        </FichaOverlay>
      ) : null}

      {edicion?.tipo === "sitio" ? (
        <FichaOverlay titulo="Título y bajada" onCerrar={cerrarEdicion}>
          <EditorSitio
            titulo={titulo}
            bajada={bajada}
            onCancelar={cerrarEdicion}
            onGuardado={() => {
              cerrarEdicion();
              router.refresh();
            }}
          />
        </FichaOverlay>
      ) : null}
    </BusquedaProvider>
  );
}
