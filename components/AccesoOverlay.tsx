"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import FichaOverlay from "@/components/FichaOverlay";

export default function AccesoOverlay({ onCerrar }: { onCerrar: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const supabase = createSupabaseBrowser();
    const { data, error: errorAuth } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (errorAuth || !data.user) {
      setCargando(false);
      setError("Email o contraseña incorrectos.");
      return;
    }

    const { data: autor } = await supabase
      .from("autores")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!autor) {
      await supabase.auth.signOut();
      setCargando(false);
      setError("Esta cuenta no es del autor.");
      return;
    }

    setCargando(false);
    onCerrar();
    router.refresh();
  }

  return (
    <FichaOverlay titulo="Acceso restringido" onCerrar={onCerrar}>
      <h2 className="mb-6 font-display text-3xl text-tinta">elAutor</h2>
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label className="font-clinico text-xs text-tinta/50">email</label>
          <input
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
          />
        </div>
        <div>
          <label className="font-clinico text-xs text-tinta/50">
            contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
          />
        </div>
        {error ? (
          <p className="font-clinico text-xs text-expediente">{error}</p>
        ) : null}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={cargando}
            className="bg-zocalo-oscuro px-4 py-2 font-clinico text-xs text-yeso hover:bg-salida disabled:opacity-50"
          >
            {cargando ? "verificando..." : "entrar"}
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="px-4 py-2 font-clinico text-xs text-tinta/60 hover:text-tinta"
          >
            cancelar
          </button>
        </div>
      </form>
    </FichaOverlay>
  );
}
