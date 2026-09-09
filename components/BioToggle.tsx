"use client";

import { useEffect, useState } from "react";

const DURACION_FADE_MS = 560;

export default function BioToggle({ texto }: { texto: string }) {
  const [montado, setMontado] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("bio-abierta", montado);
    return () => document.body.classList.remove("bio-abierta");
  }, [montado]);

  useEffect(() => {
    if (!montado) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", onKey);
    };
  }, [montado]);

  function abrir() {
    setMontado(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }

  function cerrar() {
    setVisible(false);
  }

  useEffect(() => {
    if (montado && !visible) {
      const t = window.setTimeout(() => setMontado(false), DURACION_FADE_MS);
      return () => window.clearTimeout(t);
    }
  }, [montado, visible]);

  return (
    <>
      <button
        type="button"
        aria-expanded={montado}
        aria-controls="ficha-biografia"
        onClick={() => (visible ? cerrar() : abrir())}
        className={`bio-boton ${visible ? "bio-boton-activo" : ""}`}
      >
        biografía
      </button>

      {montado ? (
        <div
          className={`bio-velo ${visible ? "bio-velo-on" : ""}`}
          onClick={cerrar}
          role="presentation"
        >
          <aside
            id="ficha-biografia"
            role="dialog"
            aria-modal="true"
            aria-label="Biografía"
            className="bio-ficha"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-5 font-clinico text-[11px] uppercase tracking-[0.18em] text-tinta/45">
              Ficha del paciente
            </p>
            <div className="prosa-entrada whitespace-pre-line text-tinta">
              {texto || "Todavía no hay biografía cargada."}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
