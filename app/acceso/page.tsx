"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Acceso() {
  return (
    <Suspense fallback={null}>
      <FormularioAcceso />
    </Suspense>
  );
}

function FormularioAcceso() {
  const router = useRouter();
  const params = useSearchParams();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    setCargando(false);

    if (res.ok) {
      router.push(params.get("desde") || "/panel");
      router.refresh();
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-tinta px-6">
      <div className="w-full max-w-sm">
        <p className="mb-1 font-clinico text-xs text-yeso/40">
          ACCESO RESTRINGIDO
        </p>
        <h1 className="mb-8 font-display text-3xl text-yeso">
          Apatía mental
        </h1>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="font-clinico text-xs text-yeso/50">
              usuario
            </label>
            <input
              autoFocus
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="mt-1 w-full border border-yeso/20 bg-transparent px-3 py-2 font-texto text-yeso outline-none focus:border-salida"
            />
          </div>
          <div>
            <label className="font-clinico text-xs text-yeso/50">
              contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-yeso/20 bg-transparent px-3 py-2 font-texto text-yeso outline-none focus:border-salida"
            />
          </div>

          {error && (
            <p className="font-clinico text-xs text-expediente">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-salida py-2 font-clinico text-sm text-yeso hover:bg-zocalo-oscuro disabled:opacity-50"
          >
            {cargando ? "verificando..." : "entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
