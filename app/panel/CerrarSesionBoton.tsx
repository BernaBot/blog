"use client";

import { useRouter } from "next/navigation";

export default function CerrarSesionBoton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/");
        router.refresh();
      }}
      className="font-clinico text-xs text-tinta/50 hover:text-expediente"
    >
      cerrar sesión
    </button>
  );
}
