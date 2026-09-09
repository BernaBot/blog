import { redirect } from "next/navigation";

export default function EditarEntrada({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/?editar=${params.id}`);
}
