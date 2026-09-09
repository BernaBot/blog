"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useBusqueda } from "@/components/Busqueda";

export default function Buscador() {
  const { q, setQ } = useBusqueda();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const ultimoUrl = useRef(q);

  function onChange(valor: string) {
    setQ(valor);
    if (pathname !== "/") {
      const destino = valor.trim()
        ? `/?q=${encodeURIComponent(valor.trim())}`
        : "/";
      router.push(destino, { scroll: false });
    }
  }

  useEffect(() => {
    if (pathname !== "/") return;
    const t = window.setTimeout(() => {
      const siguiente = new URLSearchParams(params.toString());
      const limpio = q.trim();
      if (limpio) siguiente.set("q", limpio);
      else siguiente.delete("q");
      const qs = siguiente.toString();
      const url = qs ? `/?${qs}` : "/";
      if (ultimoUrl.current === url) return;
      ultimoUrl.current = url;
      router.replace(url, { scroll: false });
    }, 350);
    return () => window.clearTimeout(t);
  }, [q, pathname, params, router]);

  return (
    <div className="dintel-buscar font-texto text-sm">
      <input
        type="search"
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder="buscar en el expediente..."
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
