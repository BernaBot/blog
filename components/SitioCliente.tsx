"use client";

import Header from "@/components/Header";
import Buscador from "@/components/Buscador";
import VistaPuerta from "@/components/VistaPuerta";
import IrArriba from "@/components/IrArriba";
import { BusquedaProvider } from "@/components/Busqueda";
import type { Entrada } from "@/lib/types";

export default function SitioCliente({
  titulo,
  bajada,
  biografia,
  entradas,
}: {
  titulo: string;
  bajada: string;
  biografia?: string;
  entradas: Entrada[];
}) {
  return (
    <BusquedaProvider>
      <main>
        <Header titulo={titulo} bajada={bajada} biografia={biografia}>
          <Buscador />
        </Header>
        <div className="pasillo">
          <div className="pasillo-escena" aria-hidden="true">
            <div className="pasillo-foto" />
          </div>
          <div className="pasillo-umbral" aria-hidden="true" />
          <div className="puerta">
            <VistaPuerta entradas={entradas} />
            <IrArriba />
          </div>
        </div>
      </main>
    </BusquedaProvider>
  );
}
