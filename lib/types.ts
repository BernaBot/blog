export type Medio = {
  tipo: "video" | "audio" | "enlace";
  url: string;
  titulo?: string;
};

export type Entrada = {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  contenido: string;
  categorias: string[];
  medios: Medio[];
  publicado: boolean;
  creado_en: string;
  actualizado_en: string;
};
