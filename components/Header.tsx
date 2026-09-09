"use client";

import type { ReactNode } from "react";
import BioToggle from "@/components/BioToggle";
import AutorBarra from "@/components/AutorBarra";

export default function Header({
  titulo,
  bajada,
  biografia,
  esAutor,
  onNueva,
  onEditarSitio,
  onSalir,
  children,
}: {
  titulo: string;
  bajada: string;
  biografia?: string;
  esAutor?: boolean;
  onNueva?: () => void;
  onEditarSitio?: () => void;
  onSalir?: () => void;
  children?: ReactNode;
}) {
  return (
    <header className="dintel">
      <img src="/dintel.png" alt={titulo} className="dintel-foto" />
      <h1 className="sr-only">{titulo}</h1>
      <p className="dintel-bajada font-masthead italic tracking-[0.04em] text-tinta/70">
        {bajada}
      </p>
      {esAutor && onNueva && onEditarSitio && onSalir ? (
        <AutorBarra
          onNueva={onNueva}
          onEditarSitio={onEditarSitio}
          onSalir={onSalir}
        />
      ) : null}
      <BioToggle texto={biografia || ""} esAutor={esAutor} />
      {children ? <div className="dintel-sobre">{children}</div> : null}
    </header>
  );
}
