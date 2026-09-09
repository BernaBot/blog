import type { ReactNode } from "react";
import BioToggle from "@/components/BioToggle";

export default function Header({
  titulo,
  bajada,
  biografia,
  children,
}: {
  titulo: string;
  bajada: string;
  biografia?: string;
  children?: ReactNode;
}) {
  return (
    <header className="dintel">
      <img src="/dintel.png" alt={titulo} className="dintel-foto" />
      <h1 className="sr-only">{titulo}</h1>
      <p className="dintel-bajada font-masthead italic tracking-[0.04em] text-tinta/70">
        {bajada}
      </p>
      <BioToggle texto={biografia || ""} />
      {children ? <div className="dintel-sobre">{children}</div> : null}
    </header>
  );
}
