"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DURACION_FADE_MS = 560;

export default function BioToggle({
  texto: textoInicial,
  esAutor = false,
}: {
  texto: string;
  esAutor?: boolean;
}) {
  const router = useRouter();
  const [montado, setMontado] = useState(false);
  const [visible, setVisible] = useState(false);
  const [texto, setTexto] = useState(textoInicial);
  const [borrador, setBorrador] = useState(textoInicial);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTexto(textoInicial);
    if (!editando) setBorrador(textoInicial);
  }, [textoInicial, editando]);

  useEffect(() => {
    document.body.classList.toggle("bio-abierta", montado);
    return () => document.body.classList.remove("bio-abierta");
  }, [montado]);

  useEffect(() => {
    if (!montado) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (editando) {
        setBorrador(texto);
        setError("");
        setEditando(false);
        return;
      }
      setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", onKey);
    };
  }, [montado, editando, texto]);

  function abrir() {
    setMontado(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }

  function cerrar() {
    setEditando(false);
    setError("");
    setBorrador(texto);
    setVisible(false);
  }

  async function guardar() {
    setGuardando(true);
    setError("");
    const res = await fetch("/api/config", {
      method: "PUT",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ biografia: borrador }),
    });
    setGuardando(false);
    if (!res.ok) {
      setError("No se pudo guardar.");
      return;
    }
    setTexto(borrador);
    setEditando(false);
    router.refresh();
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
          onClick={() => {
            if (!editando) cerrar();
          }}
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
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="font-clinico text-[11px] uppercase tracking-[0.18em] text-tinta/45">
                Ficha del paciente
              </p>
              {esAutor && !editando ? (
                <button
                  type="button"
                  onClick={() => {
                    setBorrador(texto);
                    setError("");
                    setEditando(true);
                  }}
                  className="font-clinico text-[11px] uppercase tracking-[0.16em] text-salida hover:underline"
                >
                  editar
                </button>
              ) : null}
            </div>

            {editando ? (
              <div className="space-y-4">
                <textarea
                  autoFocus
                  rows={10}
                  value={borrador}
                  onChange={(e) => setBorrador(e.target.value)}
                  className="w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
                />
                {error ? (
                  <p className="font-clinico text-xs text-expediente">{error}</p>
                ) : null}
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={guardar}
                    className="bg-zocalo-oscuro px-4 py-2 font-clinico text-xs text-yeso hover:bg-salida disabled:opacity-50"
                  >
                    {guardando ? "guardando..." : "guardar"}
                  </button>
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={() => {
                      setBorrador(texto);
                      setError("");
                      setEditando(false);
                    }}
                    className="px-4 py-2 font-clinico text-xs text-tinta/60 hover:text-tinta"
                  >
                    cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="prosa-entrada whitespace-pre-line text-tinta">
                {texto || "Todavía no hay biografía cargada."}
              </div>
            )}
          </aside>
        </div>
      ) : null}
    </>
  );
}
