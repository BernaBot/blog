"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Entrada } from "@/lib/types";
import { estaArriba } from "@/lib/entradas";

export default function BotonesEntrada({ entrada }: { entrada: Entrada }) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState<"publicado" | "arriba" | null>(null);
  const arriba = estaArriba(entrada);

  async function parche(cuerpo: { publicado?: boolean; arriba?: boolean }) {
    const clave = "publicado" in cuerpo ? "publicado" : "arriba";
    setOcupado(clave);
    await fetch(`/api/entradas/${entrada.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    setOcupado(null);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        disabled={ocupado !== null}
        onClick={() => parche({ publicado: !entrada.publicado })}
        className={
          entrada.publicado
            ? "text-salida hover:underline"
            : "text-expediente hover:underline"
        }
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
        className={arriba ? "text-tinta hover:underline" : "text-tinta/40 hover:text-tinta"}
      >
        {ocupado === "arriba" ? "…" : "arriba"}
      </button>
    </>
  );
}
