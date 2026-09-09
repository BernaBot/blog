"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Entrada } from "@/lib/types";
import FadeCambio from "@/components/FadeCambio";
import ListaIndice from "@/components/ListaIndice";
import ArticuloEntrada from "@/components/ArticuloEntrada";
import { useBusqueda } from "@/components/Busqueda";

export default function VistaPuerta({ entradas }: { entradas: Entrada[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const { q } = useBusqueda();
  const slug = pathname.startsWith("/entrada/")
    ? pathname.slice("/entrada/".length)
    : "";
  const entrada = slug ? entradas.find((e) => e.slug === slug) : undefined;
  const categoria = params.get("categoria") ?? "";

  const idsLista = entradas
    .filter((e) => {
      if (categoria && !e.categorias?.includes(categoria)) return false;
      const t = q.trim().toLowerCase();
      if (!t) return true;
      return [e.titulo, e.extracto, e.contenido].join(" ").toLowerCase().includes(t);
    })
    .map((e) => e.id)
    .join(",");

  const clave = entrada
    ? `entrada:${entrada.slug}`
    : slug
      ? `ausente:${slug}`
      : `lista:${categoria}:${idsLista || "vacio"}`;

  return (
    <FadeCambio clave={clave}>
      {entrada ? (
        <ArticuloEntrada entrada={entrada} />
      ) : slug ? (
        <p className="font-clinico text-sm text-[#fcfbf8]/60">
          no se encontró ese expediente.
        </p>
      ) : (
        <ListaIndice entradas={entradas} />
      )}
    </FadeCambio>
  );
}
