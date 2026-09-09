export const CATEGORIA_ARRIBA = "arriba";

export function estaArriba(entrada: { categorias?: string[] }) {
  return (entrada.categorias ?? []).includes(CATEGORIA_ARRIBA);
}

export function categoriasVisibles(categorias: string[] = []) {
  return categorias.filter((c) => c !== CATEGORIA_ARRIBA);
}

export function conArriba(categorias: string[] = [], arriba: boolean) {
  const visibles = categoriasVisibles(categorias);
  return arriba ? [...visibles, CATEGORIA_ARRIBA] : visibles;
}

export function ordenarEntradas<T extends { categorias?: string[]; creado_en: string }>(
  entradas: T[]
) {
  return [...entradas].sort((a, b) => {
    const pin = Number(estaArriba(b)) - Number(estaArriba(a));
    if (pin !== 0) return pin;
    return new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime();
  });
}

