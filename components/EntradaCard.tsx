import Link from "next/link";
import type { Entrada } from "@/lib/types";
import { categoriasVisibles } from "@/lib/entradas";

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function EntradaCard({
  entrada,
  numero,
}: {
  entrada: Entrada;
  numero: number;
}) {
  return (
    <Link
      href={`/entrada/${entrada.slug}`}
      scroll={false}
      className="entrada-card"
    >
      <span className="entrada-card-meta">
        <span>EXPEDIENTE Nº {String(numero).padStart(3, "0")}</span>
        <span>{formatearFecha(entrada.creado_en)}</span>
      </span>
      <h2 className="entrada-card-titulo">{entrada.titulo}</h2>
      {entrada.extracto ? (
        <p className="entrada-card-extracto">{entrada.extracto}</p>
      ) : null}
      {categoriasVisibles(entrada.categorias).length > 0 ? (
        <span className="entrada-card-tags">
          {categoriasVisibles(entrada.categorias).map((cat) => (
            <span key={cat}>#{cat}</span>
          ))}
        </span>
      ) : null}
      {!entrada.publicado ? (
        <span className="entrada-card-borrador">borrador — no publicado</span>
      ) : null}
    </Link>
  );
}
