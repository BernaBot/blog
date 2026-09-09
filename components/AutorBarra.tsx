"use client";

export default function AutorBarra({
  onNueva,
  onEditarSitio,
  onSalir,
}: {
  onNueva: () => void;
  onEditarSitio: () => void;
  onSalir: () => void;
}) {
  return (
    <nav className="autor-barra" aria-label="Autor">
      <button type="button" onClick={onNueva}>
        nueva
      </button>
      <button type="button" onClick={onEditarSitio}>
        sitio
      </button>
      <button type="button" onClick={onSalir}>
        salir
      </button>
    </nav>
  );
}
