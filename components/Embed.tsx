import type { Medio } from "@/lib/types";

function idYoutube(url: string) {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return m?.[1];
}

function idVimeo(url: string) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1];
}

export default function Embed({ medio }: { medio: Medio }) {
  if (medio.tipo === "video") {
    const yt = idYoutube(medio.url);
    const vm = idVimeo(medio.url);
    const src = yt
      ? `https://www.youtube.com/embed/${yt}`
      : vm
      ? `https://player.vimeo.com/video/${vm}`
      : null;

    if (src) {
      return (
        <div className="my-6 aspect-video w-full overflow-hidden border border-zocalo/40 bg-tinta">
          <iframe
            src={src}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={medio.titulo || "video embebido"}
          />
        </div>
      );
    }
    return (
      <a
        href={medio.url}
        target="_blank"
        rel="noopener noreferrer"
        className="my-4 block border border-zocalo/40 p-3 font-clinico text-sm text-salida"
      >
        ▶ {medio.titulo || medio.url}
      </a>
    );
  }

  if (medio.tipo === "audio") {
    return (
      <div className="my-6">
        {medio.titulo && (
          <p className="mb-1 font-clinico text-xs text-tinta/60">
            {medio.titulo}
          </p>
        )}
        <audio controls src={medio.url} className="w-full" />
      </div>
    );
  }

  // enlace genérico
  return (
    <a
      href={medio.url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block border border-zocalo/40 p-3 font-clinico text-sm text-salida hover:bg-zocalo/10"
    >
      → {medio.titulo || medio.url}
    </a>
  );
}
