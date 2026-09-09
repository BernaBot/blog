"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Entrada } from "@/lib/types";
import { estaArriba } from "@/lib/entradas";

export default function ControlesAutor({
  entrada,
  onEditar,
}: {
  entrada: Entrada;
  onEditar: (entrada: Entrada) => void;
}) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState<"publicado" | "arriba" | "borrar" | null>(
    null
  );
  const arriba = estaArriba(entrada);

  async function parche(cuerpo: { publicado?: boolean; arriba?: boolean }) {
    const clave = "publicado" in cuerpo ? "publicado" : "arriba";
    setOcupado(clave);
    await fetch(`/api/entradas/${entrada.id}`, {
      method: "PATCH",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    setOcupado(null);
    router.refresh();
  }

  async function eliminar() {
    if (!confirm("¿Eliminar esta entrada? No se puede deshacer.")) return;
    setOcupado("borrar");
    await fetch(`/api/entradas/${entrada.id}`, { method: "DELETE" });
    setOcupado(null);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-3 font-clinico text-[11px] uppercase tracking-[0.14em] text-[#fcfbf8]/55">
      <button
        type="button"
        onClick={() => onEditar(entrada)}
        className="hover:text-white"
      >
        editar
      </button>
      <button
        type="button"
        disabled={ocupado !== null}
        onClick={() => parche({ publicado: !entrada.publicado })}
        className="hover:text-white"
      >
        {ocupado === "publicado"
          ? "…"
          : entrada.publicado
            ? "publicada"
            : "borrador"}
      </button>
      <button
        type="button"
        disabled={ocupado !== null}
        onClick={() => parche({ arriba: !arriba })}
        className="hover:text-white"
      >
        {ocupado === "arriba" ? "…" : arriba ? "arriba" : "fijar"}
      </button>
      <button
        type="button"
        disabled={ocupado !== null}
        onClick={eliminar}
        className="hover:text-[#e0b4a8]"
      >
        {ocupado === "borrar" ? "…" : "eliminar"}
      </button>
    </div>
  );
}
