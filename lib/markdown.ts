import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

// Convierte el contenido (markdown simple) de una entrada a HTML.
// El contenido siempre lo escribe el propio autor desde el panel,
// así que no hay necesidad de sanitizar entrada de terceros.
export function renderContenido(md: string) {
  return marked.parse(md ?? "") as string;
}
