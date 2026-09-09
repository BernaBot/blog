import { revalidatePath } from "next/cache";

export function revalidarContenido(slug?: string, id?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/panel");
  if (id) revalidatePath(`/panel/editar/${id}`);
  if (slug) revalidatePath(`/entrada/${slug}`);
}
