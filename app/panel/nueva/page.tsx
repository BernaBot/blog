import { redirect } from "next/navigation";

export default function NuevaEntrada() {
  redirect("/?nueva=1");
}
