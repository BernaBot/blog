"use client";

import { usePathname } from "next/navigation";
import FadeCambio from "@/components/FadeCambio";

export default function FadePuerta({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return <FadeCambio clave={pathname}>{children}</FadeCambio>;
}
