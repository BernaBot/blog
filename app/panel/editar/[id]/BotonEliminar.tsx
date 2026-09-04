"use client";

import { useRouter } from "next/navigation";

export default function BotonEliminar({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (!confirm("¿Eliminar esta entrada? No se puede deshacer.")) return;
        await fetch(`/api/entradas/${id}`, { method: "DELETE" });
        router.push("/panel");
        router.refresh();
      }}
      className="font-clinico text-xs text-expediente hover:underline"
    >
      eliminar entrada
    </button>
  );
}
