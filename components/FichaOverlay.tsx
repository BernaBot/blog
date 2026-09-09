"use client";

import { useEffect } from "react";

export default function FichaOverlay({
  titulo,
  ancha = false,
  onCerrar,
  children,
}: {
  titulo: string;
  ancha?: boolean;
  onCerrar: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCerrar]);

  return (
    <div className="bio-velo bio-velo-on ficha-frente" onClick={onCerrar} role="presentation">
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`bio-ficha ${ancha ? "bio-ficha-ancha" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-5 font-clinico text-[11px] uppercase tracking-[0.18em] text-tinta/45">
          {titulo}
        </p>
        {children}
      </aside>
    </div>
  );
}
