"use client";

import { useEffect, useState } from "react";

export default function EditorConfig() {
  const [abierto, setAbierto] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (abierto && Object.keys(config).length === 0) {
      fetch("/api/config")
        .then((r) => r.json())
        .then((d) => setConfig(d.config || {}));
    }
  }, [abierto]);

  async function guardar() {
    setGuardando(true);
    setMensaje("");
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setGuardando(false);
    setMensaje(res.ok ? "guardado." : "hubo un error.");
  }

  return (
    <div className="border border-zocalo/30 p-4">
      <button
        onClick={() => setAbierto(!abierto)}
        className="font-clinico text-xs text-tinta/60 hover:text-salida"
      >
        {abierto ? "▾" : "▸"} editar título, bajada y biografía
      </button>

      {abierto && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="font-clinico text-xs text-tinta/50">título del sitio</label>
            <input
              value={config.titulo_sitio ?? ""}
              onChange={(e) =>
                setConfig({ ...config, titulo_sitio: e.target.value })
              }
              className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto"
            />
          </div>
          <div>
            <label className="font-clinico text-xs text-tinta/50">bajada</label>
            <input
              value={config.bajada ?? ""}
              onChange={(e) => setConfig({ ...config, bajada: e.target.value })}
              className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto"
            />
          </div>
          <div>
            <label className="font-clinico text-xs text-tinta/50">biografía</label>
            <textarea
              rows={6}
              value={config.biografia ?? ""}
              onChange={(e) =>
                setConfig({ ...config, biografia: e.target.value })
              }
              className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto"
            />
          </div>
          <button
            onClick={guardar}
            disabled={guardando}
            className="bg-zocalo-oscuro px-4 py-2 font-clinico text-xs text-yeso hover:bg-salida disabled:opacity-50"
          >
            {guardando ? "guardando..." : "guardar cambios"}
          </button>
          {mensaje && (
            <span className="ml-3 font-clinico text-xs text-tinta/50">
              {mensaje}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
