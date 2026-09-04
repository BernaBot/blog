import Link from "next/link";
import type { Entrada } from "@/lib/types";

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
    <article className="border-b border-zocalo/30 py-6">
      <div className="flex items-baseline justify-between font-clinico text-[11px] text-tinta/50">
        <span>EXPEDIENTE Nº {String(numero).padStart(3, "0")}</span>
        <span>{formatearFecha(entrada.creado_en)}</span>
      </div>
      <Link href={`/entrada/${entrada.slug}`}>
        <h2 className="mt-1 font-display text-2xl text-tinta hover:text-salida">
          {entrada.titulo}
        </h2>
      </Link>
      {entrada.extracto && (
        <p className="mt-2 font-texto text-tinta/75">{entrada.extracto}</p>
      )}
      {entrada.categorias?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {entrada.categorias.map((cat) => (
            <Link
              key={cat}
              href={`/?categoria=${encodeURIComponent(cat)}`}
              className="font-clinico text-[11px] text-zocalo-oscuro hover:text-salida"
            >
              #{cat}
            </Link>
          ))}
        </div>
      )}
      {!entrada.publicado && (
        <span className="mt-2 inline-block font-clinico text-[10px] text-expediente">
          borrador — no publicado
        </span>
      )}
    </article>
  );
}
