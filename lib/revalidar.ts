import { revalidatePath } from "next/cache";

export function revalidarContenido(slug?: string) {
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/entrada/${slug}`);
}
