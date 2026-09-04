"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Escucha lo que se va tipeando en cualquier parte del sitio público.
// Si en algún momento el buffer termina en "espejo", te manda a /acceso.
// No hace falta hacer foco en ningún campo: alcanza con teclear.
const PALABRA_SECRETA = "espejo";

export default function SecretListener() {
  const router = useRouter();
  const buffer = useRef("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // ignorar si se está escribiendo en un input/textarea real
      const activo = document.activeElement;
      const enCampo =
        activo instanceof HTMLInputElement ||
        activo instanceof HTMLTextAreaElement;
      if (enCampo) return;

      if (e.key.length === 1) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(-20);
        if (buffer.current.endsWith(PALABRA_SECRETA)) {
          buffer.current = "";
          router.push("/acceso");
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
