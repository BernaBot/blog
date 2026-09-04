import Link from "next/link";

export default function Header({
  titulo,
  bajada,
}: {
  titulo: string;
  bajada: string;
}) {
  return (
    <header className="border-b border-zocalo/40 bg-yeso/40">
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-6">
        <div className="luz-tubo mb-4 h-[3px] w-16 bg-salida/70" />
        <Link href="/">
          <h1 className="font-display text-4xl tracking-tight text-tinta sm:text-5xl">
            {titulo}
          </h1>
        </Link>
        <p className="mt-2 font-texto text-lg italic text-tinta/70">
          {bajada}
        </p>
        <nav className="mt-6 flex gap-5 font-clinico text-xs text-tinta/60">
          <Link href="/" className="hover:text-salida">
            índice
          </Link>
          <Link href="/biografia" className="hover:text-salida">
            biografía
          </Link>
        </nav>
      </div>
    </header>
  );
}
