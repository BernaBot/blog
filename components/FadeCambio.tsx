"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const DURACION_MS = 560;

export default function FadeCambio({
  clave,
  children,
}: {
  clave: string;
  children: ReactNode;
}) {
  const [mostrado, setMostrado] = useState(children);
  const [encendido, setEncendido] = useState(false);
  const claveVisible = useRef(clave);
  const primerFrame = useRef(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      primerFrame.current = false;
      setEncendido(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (clave === claveVisible.current) {
      setMostrado(children);
      return;
    }

    claveVisible.current = clave;
    setEncendido(false);

    const t = window.setTimeout(() => {
      setMostrado(children);
      requestAnimationFrame(() => setEncendido(true));
    }, primerFrame.current ? 0 : DURACION_MS);

    return () => window.clearTimeout(t);
  }, [clave, children]);

  return (
    <div className={`vista-puerta ${encendido ? "vista-puerta-on" : ""}`}>
      {mostrado}
    </div>
  );
}
