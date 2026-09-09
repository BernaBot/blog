import { redirect } from "next/navigation";

export default function Acceso() {
  redirect("/?acceso=1");
}
