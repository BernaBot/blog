"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Entrada, Medio } from "@/lib/types";
import { categoriasVisibles, conArriba, estaArriba } from "@/lib/entradas";

export default function PanelForm({
  entrada,
}: {
  entrada?: Entrada;
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(entrada?.titulo ?? "");
  const [extracto, setExtracto] = useState(entrada?.extracto ?? "");
  const [contenido, setContenido] = useState(entrada?.contenido ?? "");
  const [categorias, setCategorias] = useState(
    categoriasVisibles(entrada?.categorias).join(", ")
  );
  const [publicado, setPublicado] = useState(entrada?.publicado ?? true);
  const [arriba, setArriba] = useState(estaArriba(entrada ?? {}));
  const [medios, setMedios] = useState<Medio[]>(entrada?.medios ?? []);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function agregarMedio() {
    setMedios([...medios, { tipo: "enlace", url: "", titulo: "" }]);
  }
  function actualizarMedio(i: number, campo: keyof Medio, valor: string) {
    const copia = [...medios];
    // @ts-expect-error - campo puede ser tipo/url/titulo
    copia[i][campo] = valor;
    setMedios(copia);
  }
  function quitarMedio(i: number) {
    setMedios(medios.filter((_, idx) => idx !== i));
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");

    const cuerpo = {
      titulo,
      extracto,
      contenido,
      categorias: conArriba(
        categorias
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .filter(Boolean),
        arriba
      ),
      medios: medios.filter((m) => m.url.trim()),
      publicado,
    };

    const url = entrada ? `/api/entradas/${entrada.id}` : "/api/entradas";
    const metodo = entrada ? "PUT" : "POST";

    const res = await fetch(url, {
      method: metodo,
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });

    setGuardando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo guardar.");
      return;
    }

    router.push("/panel");
    router.refresh();
  }

  return (
    <form onSubmit={guardar} className="space-y-6">
      {error && (
        <p className="border border-expediente/50 bg-expediente/10 p-3 font-clinico text-sm text-expediente">
          {error}
        </p>
      )}

      <div>
        <label className="font-clinico text-xs text-tinta/60">título</label>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto text-lg outline-none focus:border-salida"
        />
      </div>

      <div>
        <label className="font-clinico text-xs text-tinta/60">
          extracto (aparece en el índice)
        </label>
        <textarea
          value={extracto}
          onChange={(e) => setExtracto(e.target.value)}
          rows={2}
          className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
        />
      </div>

      <div>
        <label className="font-clinico text-xs text-tinta/60">
          contenido (admite markdown: **negrita**, *itálica*, [link](url), etc.)
        </label>
        <textarea
          required
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={14}
          className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
        />
      </div>

      <div>
        <label className="font-clinico text-xs text-tinta/60">
          categorías / # (separadas por coma)
        </label>
        <input
          value={categorias}
          onChange={(e) => setCategorias(e.target.value)}
          placeholder="insomnio, hospital, marzo"
          className="mt-1 w-full border border-zocalo/50 bg-yeso px-3 py-2 font-texto outline-none focus:border-salida"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="font-clinico text-xs text-tinta/60">
            medios embebidos (video, audio o enlace)
          </label>
          <button
            type="button"
            onClick={agregarMedio}
            className="font-clinico text-xs text-salida hover:underline"
          >
            + agregar medio
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {medios.map((m, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 border border-zocalo/40 p-2"
            >
              <select
                value={m.tipo}
                onChange={(e) => actualizarMedio(i, "tipo", e.target.value)}
                className="border border-zocalo/50 bg-yeso px-2 py-1 font-clinico text-xs"
              >
                <option value="enlace">enlace</option>
                <option value="video">video</option>
                <option value="audio">audio</option>
              </select>
              <input
                value={m.url}
                onChange={(e) => actualizarMedio(i, "url", e.target.value)}
                placeholder="https://..."
                className="min-w-[200px] flex-1 border border-zocalo/50 bg-yeso px-2 py-1 font-texto text-sm"
              />
              <input
                value={m.titulo}
                onChange={(e) => actualizarMedio(i, "titulo", e.target.value)}
                placeholder="título (opcional)"
                className="min-w-[140px] flex-1 border border-zocalo/50 bg-yeso px-2 py-1 font-texto text-sm"
              />
              <button
                type="button"
                onClick={() => quitarMedio(i)}
                className="font-clinico text-xs text-expediente hover:underline"
              >
                quitar
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 font-clinico text-xs text-tinta/70">
        <input
          type="checkbox"
          checked={publicado}
          onChange={(e) => setPublicado(e.target.checked)}
        />
        publicada (si está destildado queda como borrador)
      </label>

      <label className="flex items-center gap-2 font-clinico text-xs text-tinta/70">
        <input
          type="checkbox"
          checked={arriba}
          onChange={(e) => setArriba(e.target.checked)}
        />
        fijar arriba (sale primero, sin importar la fecha)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="bg-zocalo-oscuro px-5 py-2 font-clinico text-sm text-yeso hover:bg-salida disabled:opacity-50"
        >
          {guardando ? "guardando..." : "guardar"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/panel")}
          className="px-5 py-2 font-clinico text-sm text-tinta/60 hover:text-tinta"
        >
          cancelar
        </button>
      </div>
    </form>
  );
}
