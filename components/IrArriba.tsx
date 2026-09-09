"use client";

export default function IrArriba() {
  return (
    <button
      type="button"
      className="ir-arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ir arriba
    </button>
  );
}
