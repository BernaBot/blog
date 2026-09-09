"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

const BusquedaCtx = createContext<{
  q: string;
  setQ: (valor: string) => void;
} | null>(null);

export function BusquedaProvider({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const valor = useMemo(() => ({ q, setQ }), [q]);

  return <BusquedaCtx.Provider value={valor}>{children}</BusquedaCtx.Provider>;
}

export function useBusqueda() {
  const ctx = useContext(BusquedaCtx);
  if (!ctx) {
    throw new Error("useBusqueda must be used inside BusquedaProvider");
  }
  return ctx;
}
