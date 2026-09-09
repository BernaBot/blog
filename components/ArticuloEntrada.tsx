"use client";

import Link from "next/link";
import { renderContenido } from "@/lib/markdown";
import { categoriasVisibles } from "@/lib/entradas";
import Embed from "@/components/Embed";
import type { Entrada } from "@/lib/types";

export default function ArticuloEntrada({ entrada }: { entrada: Entrada }) {
  return (
    <article>
      <Link
        href="/"
        scroll={false}
        className="font-clinico text-xs text-[#fcfbf8]/55 hover:text-white"
      >
        ← volver al índice
      </Link>

      <h1 className="mt-4 font-display text-3xl leading-snug tracking-[0.04em] text-[#fcfbf8] sm:text-4xl">
        {entrada.titulo}
      </h1>
      <p className="mt-2 font-clinico text-xs text-[#fcfbf8]/55">
        {new Date(entrada.creado_en).toLocaleDateString("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {categoriasVisibles(entrada.categorias).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 font-clinico text-[11px] text-[#ebe6d4]">
          {categoriasVisibles(entrada.categorias).map((cat) => (
            <span key={cat}>#{cat}</span>
          ))}
        </div>
      )}

      <div
        className="prosa-entrada mt-8"
        dangerouslySetInnerHTML={{ __html: renderContenido(entrada.contenido) }}
      />

      {entrada.medios?.length > 0 && (
        <div className="mt-8 border-t border-zocalo/30 pt-6">
          {entrada.medios.map((m, i) => (
            <Embed key={i} medio={m} />
          ))}
        </div>
      )}
    </article>
  );
}
