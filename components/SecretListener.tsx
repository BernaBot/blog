"use client";

import { useEffect, useRef } from "react";
import { pedirAcceso } from "@/lib/eventos";

const PALABRA_SECRETA = "espejo";

export default function SecretListener() {
  const buffer = useRef("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const activo = document.activeElement;
      const enCampo =
        activo instanceof HTMLInputElement ||
        activo instanceof HTMLTextAreaElement;
      if (enCampo) return;

      if (e.key.length === 1) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(-20);
        if (buffer.current.endsWith(PALABRA_SECRETA)) {
          buffer.current = "";
          pedirAcceso();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
