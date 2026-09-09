"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Entrada } from "@/lib/types";
import { categoriasVisibles } from "@/lib/entradas";
import { useBusqueda } from "@/components/Busqueda";
import EntradaCard from "@/components/EntradaCard";

function coincide(entrada: Entrada, q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  const campos = [entrada.titulo, entrada.extracto, entrada.contenido]
    .join(" ")
    .toLowerCase();
  return campos.includes(t);
}

export default function ListaIndice({ entradas }: { entradas: Entrada[] }) {
  const { q } = useBusqueda();
  const params = useSearchParams();
  const categoria = params.get("categoria") ?? "";

  const todasCategorias = useMemo(
    () =>
      Array.from(
        new Set(entradas.flatMap((e) => categoriasVisibles(e.categorias)))
      ).sort(),
    [entradas]
  );

  const numeros = useMemo(() => {
    const mapa = new Map<string, number>();
    entradas.forEach((e, i) => mapa.set(e.id, entradas.length - i));
    return mapa;
  }, [entradas]);

  const filtradas = useMemo(
    () =>
      entradas.filter((e) => {
        if (categoria && !e.categorias?.includes(categoria)) return false;
        return coincide(e, q);
      }),
    [entradas, categoria, q]
  );

  const hrefTodas = q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : "/";

  return (
    <>
      {todasCategorias.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3 font-clinico text-xs text-[#fcfbf8]/50">
          <Link
            href={hrefTodas}
            scroll={false}
            className={!categoria ? "text-[#fcfbf8]" : "hover:text-[#fcfbf8]"}
          >
            todas
          </Link>
          {todasCategorias.map((c) => {
            const href = q.trim()
              ? `/?categoria=${encodeURIComponent(c)}&q=${encodeURIComponent(q.trim())}`
              : `/?categoria=${encodeURIComponent(c)}`;
            return (
              <Link
                key={c}
                href={href}
                scroll={false}
                className={
                  categoria === c ? "text-[#fcfbf8]" : "hover:text-[#fcfbf8]"
                }
              >
                #{c}
              </Link>
            );
          })}
        </div>
      )}

      {filtradas.length === 0 ? (
        <p className="font-clinico text-sm text-[#fcfbf8]/60">
          {q.trim()
            ? "no hay expedientes con esa búsqueda."
            : "no hay entradas todavía."}
        </p>
      ) : (
        filtradas.map((e) => (
          <EntradaCard
            key={e.id}
            entrada={e}
            numero={numeros.get(e.id) ?? 0}
          />
        ))
      )}
    </>
  );
}
