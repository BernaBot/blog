"use client";

import { useState } from "react";

export default function EditorSitio({
  titulo,
  bajada,
  onCancelar,
  onGuardado,
}: {
  titulo: string;
  bajada: string;
  onCancelar: () => void;
  onGuardado: () => void;
}) {
  const [tituloSitio, setTituloSitio] = useState(titulo);
  const [bajadaSitio, setBajadaSitio] = useState(bajada);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    const res = await fetch("/api/config", {
      method: "PUT",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo_sitio: tituloSitio,
        bajada: bajadaSitio,
      }),
    });
    setGuardando(false);
    if (!res.ok) {
      setError("No se pudo guardar.");
      return;
    }
    onGuardado();
  }

  return (
    <form onSubmit={guardar} className="space-y-4">
      {error ? (
        <p className="font-clinico text-xs text-expediente">{error}</p>
      ) : null}
      <div>
        <label className="font-clinico text-xs text-tinta/50">
          título del sitio
        </label>
        <input
          value={tituloSitio}
          onChange={(e) => setTituloSitio(e.target.value)}
          className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
        />
      </div>
      <div>
        <label className="font-clinico text-xs text-tinta/50">bajada</label>
        <input
          value={bajadaSitio}
          onChange={(e) => setBajadaSitio(e.target.value)}
          className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="bg-zocalo-oscuro px-4 py-2 font-clinico text-xs text-yeso hover:bg-salida disabled:opacity-50"
        >
          {guardando ? "guardando..." : "guardar"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 font-clinico text-xs text-tinta/60 hover:text-tinta"
        >
          cancelar
        </button>
      </div>
    </form>
  );
}
